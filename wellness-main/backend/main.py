from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from models import ChatRequest, UserContext, ChatMessage, Recommendation, DoubtRequest, MealAnalysisRequest
from agent import AroMiAgent
from db import Database, get_database
from dotenv import load_dotenv

load_dotenv()

# Lifespan events for database connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Database.connect_db()
    # Clear database on startup as requested: "set all the data to null"
    db = get_database()
    await db.get_collection("users").delete_many({})
    await db.get_collection("chat_history").delete_many({})
    print("✓ Reset database: All data set to null/empty")
    yield
    # Shutdown
    Database.close_db()

app = FastAPI(title="AroMi AI Agent API", lifespan=lifespan)

# Collections will be initialized after database connection
users_collection = None
chat_history_collection = None
recommendations_collection = None
wellness_plans_collection = None

def get_collections():
    global users_collection, chat_history_collection, recommendations_collection, wellness_plans_collection
    if users_collection is None:
        db = get_database()
        users_collection = db.get_collection("users")
        chat_history_collection = db.get_collection("chat_history")
        recommendations_collection = db.get_collection("recommendations")
        wellness_plans_collection = db.get_collection("wellness_plans")
    return users_collection, chat_history_collection, recommendations_collection, wellness_plans_collection

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev purposes only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = AroMiAgent()

@app.get("/")
def read_root():
    return {"message": "Welcome to AroMi AI Health Coach API"}

@app.get("/user/{user_id}")
async def get_user(user_id: str):
    try:
        users_col, _, _, _ = get_collections()
        user = await users_col.find_one({"user_id": user_id}, {"_id": 0})
        if not user:
            # Return a default context if user not found
            return {
                "user_id": user_id,
                "name": "User",
                "age": 25,
                "gender": "other",
                "height": 170,
                "weight": 70,
                "mood": "neutral",
                "energy_level": 5,
                "activity_type": "sedentary",
                "health_goals": [],
                "steps": 0,
                "calories_burned": 0,
                "todos": [],
                "vitals": {"heart_rate": 72, "bmi": 24.2, "daily_calories": 2000}
            }
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/user/update")
async def update_user(request: UserContext):
    try:
        users_col, _, _, _ = get_collections()
        await users_col.update_one(
            {"user_id": request.user_id},
            {"$set": request.model_dump()},
            upsert=True
        )
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        users_col, chat_col, _, _ = get_collections()
        
        # Persist/Update user context in MongoDB
        user_data = request.context.model_dump()
        await users_col.update_one(
            {"user_id": request.user_id},
            {"$set": user_data},
            upsert=True
        )
        
        # Generate AI response
        response_text = agent.generate_response(request.message, request.context)
        
        # Save chat history
        await chat_col.insert_one({
            "user_id": request.user_id,
            "message": request.message,
            "response": response_text
        })
        
        return {
            "response": response_text,
            "updated_context": request.context
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommendation")
async def get_recommendation(context: UserContext):
    rec = agent.get_proactive_recommendation(context)
    return rec

@app.post("/wellness-plan")
async def get_wellness_plan(context: UserContext):
    return agent.generate_wellness_plan(context)

@app.post("/clarify-doubt")
async def clarify_doubt_endpoint(request: DoubtRequest):
    answer = agent.clarify_doubt(request.question, request.context)
    return {"answer": answer}

@app.post("/analyze-meal")
async def analyze_meal_endpoint(request: MealAnalysisRequest):
    insight = agent.analyze_meal(request.image_data, request.context)
    return {"insight": insight}

@app.get("/store")
def get_store_items():
    return [
        {"id": 1, "name": "Smart Yoga Mat", "price": "₹2,499", "image": "https://m.media-amazon.com/images/I/61bd90sMnSL._AC_UF1000,1000_QL80_.jpg", "category": "Fitness"},
        {"id": 2, "name": "Meditation Cushion", "price": "₹1,499", "image": "https://m.media-amazon.com/images/I/71wHKtL+JCL.jpg", "category": "Mindfulness"},
        {"id": 3, "name": "Hydro Flask", "price": "₹1,199", "image": "https://m.media-amazon.com/images/I/61ngk9C4kOL._AC_UF1000,1000_QL80_.jpg", "category": "Lifestyle"},
        {"id": 4, "name": "Resistance Bands", "price": "₹499", "image": "https://m.media-amazon.com/images/I/71+pOdQ7iKL._AC_UF894,1000_QL80_.jpg", "category": "Fitness"},
        {"id": 5, "name": "Aromatherapy Diffuser", "price": "₹999", "image": "https://m.media-amazon.com/images/I/71+b+9e9jZL._AC_UF894,1000_QL80_.jpg", "category": "Relaxation"}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
