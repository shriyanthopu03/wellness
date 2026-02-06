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

    def generate_response(self, message: str, context: UserContext):
        try:
            if self.use_ai:
                prompt = self._build_prompt(message, context)
                response = self._generate(prompt)
                if response != "FALLBACK_TRIGGERED":
                    return response
            return self._fallback_response(message, context)
        except Exception as e:
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
        try:
            if self.use_gemini or self.use_rest_fallback:
                prompt = f"""Generate a proactive health tip... [omitted for brevity]"""
                # ... check for FALLBACK_TRIGGERED
        except:
            pass
        
        # Enhanced Fallbacks
        if context.energy_level < 4:
            return Recommendation(category="Physical", suggestion="15-min Power Nap", reasoning="Quick rest resets cognitive load for better focus.")
        if "muscle gain" in context.health_goals:
            return Recommendation(category="Lifestyle", suggestion="Protein Snack", reasoning="Supports muscle repair after your earlier activities.")
        return Recommendation(category="Mental", suggestion="Mindful Minute", reasoning="Brief meditation reduces cortisol levels effectively.")

    def generate_wellness_plan(self, context: UserContext):
        try:
            if self.use_gemini or self.use_rest_fallback:
                prompt = f"""Create a JSON wellness plan... [omitted]"""
                # ... same check
        except:
            pass
        return {
            "daily_tip": f"Progress is better than perfection, {context.name}. Keep going!",
            "workout_plan": "20-minute bodyweight circuit (Squats, Push-ups, Lunges)" if context.energy_level > 6 else "15-minute gentle mobility flow",
            "diet_suggestion": "Hydration first! Then a protein-rich meal with complex carbs."
        }

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
                
                # Simple parsing (robustness can be improved)
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
                # Use Groq Vision model
                url = "https://api.groq.com/openai/v1/chat/completions"
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {self.api_key}'
                }
                
                # Highly directive and descriptive prompt for better vision results
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
                If the image does NOT contain food, politely ask them to upload a photo of their meal.
                """
                
                data = {
                    "model": "llama-3.2-11b-vision-preview",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text", 
                                    "text": prompt_text
                                },
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": image_data,
                                        "detail": "low" # Speed up and handle large base64 better
                                    }
                                }
                            ]
                        }
                    ],
                    "max_tokens": 800,
                    "temperature": 0.1 # Lower temperature for better accuracy in recognition
                }
                
                print(f"Sending meal analysis request to Groq for {context.name}...")
                response = requests.post(url, headers=headers, json=data, timeout=30)
                
                if response.status_code != 200:
                    error_msg = response.json().get('error', {}).get('message', 'Unknown error')
                    print(f"Groq API Error ({response.status_code}): {error_msg}")
                    return f"AroMi is having trouble seeing the meal clearly right now ({error_msg}). Please try again with a smaller file or better lighting."

                analysis = response.json()['choices'][0]['message']['content']
                print("✓ Analysis generated successfully.")
                return analysis
                
            except Exception as e:
                print(f"Groq vision analysis failed: {str(e)}")
                return f"I'm sorry, I encountered an error while analyzing the image. Please ensure it's a valid photo and try again."
        
        return "Groq Vision API is not configured. Please add a valid GROQ_API_KEY to your .env file."
