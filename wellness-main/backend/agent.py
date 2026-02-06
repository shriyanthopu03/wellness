import os
import requests
import json
try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False
except TypeError:
    # Handle the "Metaclasses with custom tp_new" error for Python 3.14 compatibility
    HAS_GEMINI = False
    print("Warning: Google Generative AI not supported in this Python environment (Protobuf/Python version mismatch).")

from models import UserContext, Recommendation
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from the same directory as this file
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

class AroMiAgent:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.use_gemini = False
        self.use_rest_fallback = False
        
        # Check for both Gemini and Grok/provided key formats
        if self.api_key and "your_gemini_api_key_here" not in self.api_key:
            # If it's a Grok/OpenAI-compatible key from the user
            if self.api_key.startswith("gsk_"):
                self.use_rest_fallback = True
                print("Using Grok API via REST.")
            elif HAS_GEMINI:
                try:
                    genai.configure(api_key=self.api_key)
                    self.model = genai.GenerativeModel('gemini-3-flash-preview')
                    self.use_gemini = True
                    print("Gemini API initialized successfully (SDK).")
                except Exception as e:
                    print(f"Gemini SDK init failed: {e}. Falling back to REST.")
                    self.use_rest_fallback = True
            else:
                print("Gemini SDK unavailable. Using REST API fallback.")
                self.use_rest_fallback = True
        else:
            print(f"API Key missing or default. Using offline mode.")

    def _call_gemini_rest(self, prompt: str, model: str = None) -> str:
        try:
            # Check if it's a Grok key
            if self.api_key.startswith("gsk_"):
                # Use llama-3.3-70b-versatile or a vision model if specified
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
            
            # Default to Gemini REST
            api_model = model if model else "gemini-3-flash-preview"
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{api_model}:generateContent?key={self.api_key}"
            headers = {'Content-Type': 'application/json'}
            data = {"contents": [{"parts": [{"text": prompt}]}]}
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            return result['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            print(f"REST API Validation Error: {e}")
            raise e

    def _generate(self, prompt: str) -> str:
        try:
            if self.use_gemini:
                return self.model.generate_content(prompt).text
            elif self.use_rest_fallback:
                return self._call_gemini_rest(prompt)
            else:
                raise Exception("AI Offline")
        except Exception as e:
            # Check for rate limit or service unavailable
            error_str = str(e).lower()
            if "429" in error_str or "503" in error_str or "unavailable" in error_str:
                print(f"Warning: AI Model experiencing high load. Switching to enhanced fallback.")
                return "FALLBACK_TRIGGERED"
            raise e

    def generate_response(self, message: str, context: UserContext):
        try:
            if self.use_gemini or self.use_rest_fallback:
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
        if self.use_gemini or self.use_rest_fallback:
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
                print(f"Gemini recommendation error: {e}")
        
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
        if self.use_gemini or self.use_rest_fallback:
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
                print(f"Gemini wellness plan error: {e}")
        
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
        if self.use_gemini or self.use_rest_fallback:
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
                print(f"Gemini doubt error: {e}")
        
        # Fallback Offline
        return f"That's a great question, {context.name}. Since I'm currently offline, I can't look up that specific information. Generally, getting clear answers requires checking reliable sources. If this is medical, please consult a doctor."

    def analyze_meal(self, image_data: str, context: UserContext) -> str:
        """Analyzes a meal image (as base64 or link) and provides nutritional insights."""
        if self.use_rest_fallback and self.api_key.startswith("gsk_"):
            try:
                # Use Groq Vision model
                url = "https://api.groq.com/openai/v1/chat/completions"
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {self.api_key}'
                }
                # Groq vision expects a specific format for images
                data = {
                    "model": "llama-3.2-11b-vision-preview",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": f"Analyze this meal for {context.name} who is focusing on {context.health_goals[0] if context.health_goals else 'general wellness'}. Provide estimated calories, macronutrients, and a health score out of 10. Be encouraging!"},
                                {"type": "image_url", "image_url": {"url": image_data}}
                            ]
                        }
                    ],
                    "max_tokens": 500
                }
                response = requests.post(url, headers=headers, json=data)
                response.raise_for_status()
                return response.json()['choices'][0]['message']['content']
            except Exception as e:
                print(f"Groq vision analysis failed: {e}")
                return "I couldn't analyze the image right now, but a typical healthy meal should be balanced with proteins and greens!"
        
        return "Meal analysis requires an active AI connection. Please ensure your API key is configured correctly."
