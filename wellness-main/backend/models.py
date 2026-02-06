from pydantic import BaseModel
from typing import List, Optional

class UserContext(BaseModel):
    user_id: str
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None  # male, female, other
    height: Optional[float] = None  # in cm
    weight: Optional[float] = None  # in kg
    mood: Optional[str] = "neutral"  # happy, sad, stressed, energetic, tired
    energy_level: Optional[int] = 5  # 1-10
    activity_type: Optional[str] = "sedentary" # sedentary, walking, workout
    lifestyle_inputs: Optional[dict] = {
        "sleep_hours": 0,
        "diet_type": "None",
        "activity_level": "sedentary"
    }
    health_goals: Optional[List[str]] = []
    vitals: Optional[dict] = {
        "heart_rate": 0,
        "bmi": 0.0,
        "daily_calories": 0,
        "fitness_level": "Unknown",
        "sleep_quality": "unknown"
    }
    last_interaction: Optional[str] = None

class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    user_id: str
    message: str
    context: UserContext

class Recommendation(BaseModel):
    category: str # "physical", "mental", "lifestyle"
    suggestion: str
    reasoning: str

class DoubtRequest(BaseModel):
    user_id: str
    question: str
    context: UserContext

class MealAnalysisRequest(BaseModel):
    user_id: str
    image_data: str # Base64 or URL
    context: UserContext
