import os
import requests
import json
from models import UserContext, Recommendation
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from the same directory as this file
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(dotenv_path=env_path, override=True)

class AroMiAgent:
    def __init__(self):
        # Force reload if not found
        self.api_key = os.getenv("GROQ_API_KEY")
        
        if not self.api_key:
            # Try loading without path as fallback
            load_dotenv()
            self.api_key = os.getenv("GROQ_API_KEY")

        self.use_ai = False
        if self.api_key and (len(self.api_key) > 10):
            self.use_ai = True
            print(f"✓ AroMi Neural Core: Groq API Link Established. (Key starts with: {self.api_key[:6]})")
        else:
            print("⚠ AroMi Neural Core: GROQ_API_KEY missing in .env file.")

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
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            }
            response = requests.post(url, headers=headers, json=data, timeout=20)
            
            if response.status_code != 200:
                error_detail = response.text
                print(f"Groq API Error ({response.status_code}): {error_detail}")
                return f"ERROR: The neural core returned status {response.status_code}. (Details: {error_detail[:50]}...)"
                
            result = response.json()
            return result['choices'][0]['message']['content']
        except Exception as e:
            print(f"Groq Request Exception: {e}")
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
        You are AroMi, a highly personalized, empathetic, and realistic AI Wellness Coach.
        
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
        2. Give VERY realistic, actionable, and specific advice based on their current context.
        3. Keep the context (mood, goals, energy) in mind when giving advice.
        4. Be concise (2-4 sentences) and supportive.
        5. For non-English inputs, acknowledge the sentiment and reply in English.
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
                location_str = f"at {context.location}" if context.location else "in your area"
                prompt = f"""
                Generate a HIGHLY REALISTIC and ACTIONABLE health tip based on this user context:
                - Name: {context.name}
                - Mood: {context.mood}
                - Energy: {context.energy_level}/10
                - Activity: {context.activity_type}
                - Location: {context.location}
                
                Instructions:
                1. Suggest a specific, immediate action.
                2. If the user's mood or activity indicates potential health risks (e.g. very low energy, specific symptoms), include a mention of seeking professional help at nearby hospitals {location_str}.
                
                Format:
                Category: [Physical/Mental/Lifestyle]
                Suggestion: [One clear, realistic action]
                Reasoning: [Short scientific reason + a mention of nearby medical facilities if relevant]
                
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
                location_str = f"near {context.location}" if context.location else "in your area"
                prompt = f"""
                Create a customized, HIGHLY REALISTIC daily wellness plan for:
                - Name: {context.name}
                - Mood: {context.mood}
                - Energy: {context.energy_level}/10
                - Activity Level: {context.activity_type}
                - Location: {context.location}
                
                Guidelines:
                1. The plan must be specific and actionable for today.
                2. If the user's energy is critical or they've mentioned pain in previous context, suggest professional help {location_str}.
                
                Provide 3 keys in valid JSON format ONLY (no markdown backticks):
                {{
                    "daily_tip": "A realistic, science-backed motivational tip",
                    "workout_plan": "A specific exercise routine with sets/reps suitable for their energy (include a location-specific suggestion if applicable)",
                    "diet_suggestion": "A healthy, realistic meal idea based on their mood (mention hydration or local seasonal foods if possible)"
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
        """Clarifies any doubts with a helpful persona using a high-performance Groq model."""
        if self.use_ai:
            try:
                # Switching to a supported high-performance model
                model = "llama-3.3-70b-versatile"
                location_str = f"near {context.location}" if context.location else "in your vicinity"
                prompt = f"""
                You are AroMi, a highly specialized, empathetic, and scientifically-accurate AI Wellness Coach. 
                User Information:
                - Name: {context.name}
                - Health Focus: {', '.join(context.health_goals) if context.health_goals else 'Overall health'}
                - Current Mood: {context.mood}
                - Location: {context.location}

                The user has asked a query: "{question}"
                
                Guidelines:
                1. Structure your answer clearly with bullet points if helpful.
                2. Maintain a professional yet warm "Neural Coach" persona.
                3. Provide REALISTIC, actionable, and specific advice based on their current location and health profile.
                4. Ground all health advice in nutritional/biological science.
                5. Mandatory Disclaimer: If the question involves symptoms, medications, or injuries, you MUST conclude with: 
                   "PROTOCOL ALERT: I am an AI interface, not a medical professional. Please consult a licensed physician at a nearby hospital {location_str} for clinical diagnostics."
                6. Maximum 150 words.
                """
                return self._call_groq_rest(prompt, model=model)
            except Exception as e:
                print(f"Groq doubt error: {e}")
        
        # Fallback for offline mode or API issues
        return f"SYSTEM OFFLINE: Hello {context.name}. The neural core is currently disconnected from the Groq cloud. Regarding your query about '{question}', I recommend checking peer-reviewed sources until the link is restored."
    def analyze_prescription(self, image_data: str, context: UserContext) -> str:
        """Analyzes a prescription image and provides insights, suggestions, and a food routine."""
        print(f"DEBUG: Processing prescription analysis for {context.name}")
        if self.use_ai:
            try:
                # Ensure correct prefixing
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
                You are AroMi, the AI Wellness Coach and Medical Data Analyst.
                Task: Analyze the attached prescription image for {context.name}.
                
                Instructions:
                1. Identify the condition implied by the medications.
                2. Suggest lifestyle adjustments and a food routine for a specific time limit.
                3. Mandatory: Finish with a disclaimer that you are an AI and to follow doctor's advice.
                """
                
                data = {
                    "model": "meta-llama/llama-4-scout-17b-16e-instruct",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": prompt_text},
                                {"type": "image_url", "image_url": {"url": image_data}}
                            ]
                        }
                    ],
                    "max_tokens": 1024,
                    "temperature": 0.1
                }
                
                response = requests.post(url, headers=headers, json=data, timeout=60)
                if response.status_code == 200:
                    result = response.json()
                    return result['choices'][0]['message']['content'] if result.get('choices') else "Empty response from AI."
                else:
                    print(f"DEBUG: Groq API Error {response.status_code}: {response.text}")
                    return f"Neural Analysis Error ({response.status_code}): Image processing failed."
            except Exception as e:
                print(f"EXCEPTION in analyze_prescription: {e}")
                return f"Neural Processing Exception: {str(e)[:100]}"
        
        return "SYSTEM OFFLINE: Vision processing requires an active neural link (API Key)."

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
