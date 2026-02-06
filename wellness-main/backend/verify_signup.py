
import requests
import json
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def verify():
    # 1. Test POST /signup
    url = "http://localhost:8000/signup"
    user_data = {
        "user_id": "nishi_test",
        "name": "Nishi",
        "email": "nishi@example.com",
        "age": 25,
        "gender": "other",
        "height": 170.0,
        "weight": 70.0,
        "mood": "neutral",
        "energy_level": 5,
        "activity_type": "sedentary",
        "lifestyle_inputs": {
            "sleep_hours": 8,
            "diet_type": "None",
            "activity_level": "sedentary"
        },
        "health_goals": ["Be Healthy"],
        "steps": 0,
        "calories_burned": 0,
        "todos": [],
        "vitals": {
            "heart_rate": 72,
            "bmi": 24.2,
            "daily_calories": 2000,
            "fitness_level": "Unknown",
            "sleep_quality": "Good"
        }
    }
    
    print(f"--- Testing Signup for {user_data['user_id']} ---")
    try:
        response = requests.post(url, json=user_data)
        print(f"Signup Status: {response.status_code}")
        print(f"Signup Response: {response.text}")
    except Exception as e:
        print(f"Signup Request Failed: {e}")
        return

    # 2. Test GET /user/{id}
    print(f"\n--- Verifying Retrieval ---")
    try:
        get_response = requests.get(f"http://localhost:8000/user/{user_data['user_id']}")
        print(f"GET Status: {get_response.status_code}")
        if get_response.status_code == 200:
            print("✓ User found via API")
        else:
            print("✗ User NOT found via API")
    except Exception as e:
        print(f"GET Request Failed: {e}")

    # 3. Deep check in MongoDB
    print(f"\n--- Checking Database Persistence ---")
    mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/aromi_db")
    client = AsyncIOMotorClient(mongodb_uri)
    db = client.get_database()
    col = db.get_collection("users")
    
    db_user = await col.find_one({"user_id": user_data['user_id']})
    if db_user:
        print(f"✓ Found user '{db_user['user_id']}' directly in MongoDB collection 'users'")
        print(f"  Name: {db_user.get('name')}")
        print(f"  Goals: {db_user.get('health_goals')}")
    else:
        print("✗ User NOT found in MongoDB")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(verify())
