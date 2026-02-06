import os
import requests
import json
from models import UserContext, Recommendation
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from the same directory as this file
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

class AroMiAgent:
    def __init__(self):
        # Only use Groq for all AI tasks
        self.api_key = os.getenv("GROQ_API_KEY") or os.getenv("GEMINI_API_KEY")
        self.use_ai = False
        
        if self.api_key and self.api_key.startswith("gsk_"):
            self.use_ai = True
            print("✓ AroMi initialized with Groq API.")
        else:
            print("⚠ Groq API Key (gsk_...) missing. AroMi is running in offline mode.")

    def _call_groq_rest(self, prompt: str, model: str = None) -> str:
        try:
            # Groq implementation
            api_model = model if model else "llama-3.3-70b-versatile"
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.api_key}'
            }
            data = {
                "model": api_model,
                "messages": [{"role": "user", "content": prompt}]
            }
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            return result['choices'][0]['message']['content']
        except Exception as e:
            print(f"Groq API Error: {e}")
            raise e

    def _generate(self, prompt: str) -> str:
        try:
            if self.use_ai:
                return self._call_groq_rest(prompt)
            else:
                raise Exception("AI Offline")
        except Exception as e:
            # Check for rate limit or service unavailable
            error_str = str(e).lower()
            if "429" in error_str or "503" in error_str or "unavailable" in error_str:
                print(f"Warning: Groq API experiencing high load. Switching to offline fallback.")
                return "FALLBACK_TRIGGERED"
            raise e

    def _build_prompt(self, message: str, context: UserContext) -> str:
        """Constructs a detailed prompt with user context."""
        goals_str = ", ".join(context.health_goals) if context.health_goals else "General wellness"
        return f"""
        You are AroMi, a highly personalized and empathetic AI Wellness Coach.
        User Context for {context.name}:
        - Current Mood: {context.mood}
        - Energy Level: {context.energy_level}/10
        - Recent Activity: {context.activity_type}
        - Health Goals: {goals_str}
        - Daily Steps: {context.steps}
        - Last Meal Summary: {context.lifestyle_inputs.get('last_meal', 'Not recorded')}
        
        User's Message: "{message}"
        
        Instructions:
        1. Respond directly to the user's message using their name.
        2. Keep the context (mood, goals, energy) in mind when giving advice.
        3. Be concise (2-4 sentences) and supportive.
        4. If they are in pain or have medical symptoms, suggest a doctor while providing gentle comfort.
        5. If they speak in a language other than English (like Telugu: "em chesthunav"), reply in English but acknowledge their sentiment.
        """

    def generate_response(self, message: str, context: UserContext):
        try:
            if self.use_ai:
                prompt = self._build_prompt(message, context)
                response = self._generate(prompt)
                if response != "FALLBACK_TRIGGERED":
                    return response
            return self._fallback_response(message, context)
        except Exception as e:
            print(f"Chat generation error: {e}")
            return self._fallback_response(message, context)

    def _fallback_response(self, message: str, context: UserContext):
        message = message.lower()
        if "stressed" in message or context.mood == "stressed":
             return f"I hear you, {context.name}. Since you're feeling stressed (Energy: {context.energy_level}/10), let's take a deep breath together. Want to try a quick grounding exercise?"
        elif "workout" in message or "fitness" in message:
             return f"For your {context.health_goals[0] if context.health_goals else 'wellness'} goal, I recommend staying active. Your current step count of {context.steps} is a great start!"
        elif "eat" in message or "diet" in message or "food" in message:
             return f"With a {context.lifestyle_inputs.get('diet_type', 'balanced')} diet, focus on whole foods. Since your energy is {context.energy_level}/10, try something light but sustaining."
        return f"Hello {context.name}! I'm AroMi. I'm focusing on your {context.health_goals[0] if context.health_goals else 'wellness'} today. How can I support your journey specifically right now?"

    def get_proactive_recommendation(self, context: UserContext) -> Recommendation:
        if self.use_ai:
            try:
                prompt = f"""
                Generate a proactive health tip based on this user context:
                - Mood: {context.mood}
                - Energy: {context.energy_level}/10
                - Activity: {context.activity_type}
                
                Format:
                Category: [Physical/Mental/Lifestyle]
                Suggestion: [One clear action]
                Reasoning: [Short scientific reason]
                
                Respond in this exact format.
                """
                text = self._generate(prompt).strip()
                
                # Simple parsing
                lines = text.split('\n')
                cat = "General"
                sugg = "Take a moment for yourself."
                reas = "Self-care is important."
                
                for line in lines:
                    if "Category:" in line: cat = line.split("Category:")[1].strip()
                    if "Suggestion:" in line: sugg = line.split("Suggestion:")[1].strip()
                    if "Reasoning:" in line: reas = line.split("Reasoning:")[1].strip()
                    
                return Recommendation(category=cat, suggestion=sugg, reasoning=reas)
            except Exception as e:
                print(f"Groq recommendation error: {e}")
        
        # Fallback recommendations
        if context.mood == "stressed":
            return Recommendation(
                category="Mental",
                suggestion="Box Breathing (4-4-4-4)",
                reasoning="Regulates the autonomic nervous system to reduce anxiety."
            )
        else:
            return Recommendation(
                category="Lifestyle",
                suggestion="Drink 250ml of water",
                reasoning="Rehydration immediately boosts cognitive function."
            )

    def generate_wellness_plan(self, context: UserContext):
        """Generates a daily plan including tip, workout, and diet."""
        if self.use_ai:
            try:
                prompt = f"""
                Create a customized daily wellness plan for:
                - Name: {context.name}
                - Mood: {context.mood}
                - Energy: {context.energy_level}/10
                - Activity Level: {context.activity_type}
                
                Provide 3 keys in valid JSON format ONLY (no markdown backticks):
                {{
                    "daily_tip": "A short motivational quote or tip grounded in science",
                    "workout_plan": "A specific exercise routine suitable for their energy level (e.g. Yoga if low energy, HIIT if high)",
                    "diet_suggestion": "A healthy meal idea or nutritional advice based on their mood (e.g. comfort healthy food for sadness)"
                }}
                """
                text = self._generate(prompt).replace('```json', '').replace('```', '').strip()
                return json.loads(text)
            except Exception as e:
                print(f"Groq wellness plan error: {e}")
        
        # Fallback Offline Plan
        plan = {
            "daily_tip": f"Listen to your body, {context.name}. Consistency beats intensity.",
            "workout_plan": "10-minute Stretching Routine (Low Impact)",
            "diet_suggestion": "Stay hydrated! Try a green smoothie with spinach and banana."
        }
        
        if context.energy_level > 7:
            plan["workout_plan"] = "20-minute Cardio Blast (Jumping Jacks, High Knees)"
        
        if context.mood == "stressed":
            plan["diet_suggestion"] = "Avoid excessive caffeine. Try herbal tea (Chamomile) and dark chocolate."
            
        return plan

    def clarify_doubt(self, question: str, context: UserContext) -> str:
        """Clarifies any doubts with a helpful persona."""
        if self.use_ai:
            try:
                prompt = f"""
                You are AroMi, a knowledgeable and empathetic AI assistant.
                The user, {context.name}, has a question: "{question}"
                
                Context:
                - Mood: {context.mood}
                
                Instructions:
                1. Answer the user's question clearly and accurately. You can answer questions about health, science, general knowledge, or lifestyle.
                2. Be empathetic and professional.
                3. If the question is medically related, END with: "I am an AI, not a doctor. Please consult a medical professional for serious concerns."
                4. Keep the answer concise and easy to understand.
                """
                return self._generate(prompt)
            except Exception as e:
                print(f"Groq doubt error: {e}")
        
        # Fallback Offline
        return f"That's a great question, {context.name}. Since I'm currently offline, I can't look up that specific information. Generally, getting clear answers requires checking reliable sources. If this is medical, please consult a doctor."

    def analyze_meal(self, image_data: str, context: UserContext) -> str:
        """Analyzes a meal image and provides nutritional insights using Groq Vision."""
        if self.use_ai:
            try:
                if not image_data.startswith("data:image"):
                    if image_data.startswith("/9j/"): 
                        image_data = f"data:image/jpeg;base64,{image_data}"
                    elif image_data.startswith("iVBORw0KGgo"): 
                        image_data = f"data:image/png;base64,{image_data}"

                url = "https://api.groq.com/openai/v1/chat/completions"
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {self.api_key}'
                }
                
                prompt_text = f"""
                You are AroMi, the AI Wellness Coach.
                Task: Analyze the attached meal image for {context.name}.
                
                Instructions:
                1. Describe precisely what food and drinks you see.
                2. Provide a breakdown of:
                   - Estimated Calories (total)
                   - Protein, Carbohydrates, and Fats (in grams)
                3. Health Advice: How does this align with {context.health_goals if context.health_goals else "general fitness"}?
                4. Advice: What is ONE thing they could add or remove to make this meal more balanced?
                
                Tone: Be expert, encouraging, and brief.
                """
                
                data = {
                    "model": "meta-llama/llama-4-scout-17b-16e-instruct",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": prompt_text},
                                {"type": "image_url", "image_url": {"url": image_data, "detail": "low"}}
                            ]
                        }
                    ],
                    "max_tokens": 800,
                    "temperature": 0.1
                }
                
                response = requests.post(url, headers=headers, json=data, timeout=30)
                if response.status_code != 200:
                    return f"AroMi is having trouble seeing the meal clearly right now. Please try again."

                return response.json()['choices'][0]['message']['content']
                
            except Exception as e:
                return f"I'm sorry, I encountered an error while analyzing the image."
        
        return "Groq Vision API is not configured."
