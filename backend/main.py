from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from models import ChatRequest, UserContext, ChatMessage, Recommendation, DoubtRequest, MealAnalysisRequest, PrescriptionAnalysisRequest
from agent import AroMiAgent
from db import Database, get_database
from dotenv import load_dotenv

load_dotenv()

# Lifespan events for database connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await Database.connect_db()
    # Data is now persistent. If you need to reset, do it manually or via a reset endpoint.
    print("✓ Backend Biological Substrate Online")
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
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
async def login_endpoint(request: dict):
    try:
        email = request.get("email")
        password = request.get("password")
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")
        if not password:
            raise HTTPException(status_code=400, detail="Password is required")
        
        # Normalize email for case-insensitive lookup
        user_id = email.lower().strip().replace("@", "_").replace(".", "_")
        users_col, _, _, _ = get_collections()
        user = await users_col.find_one({"user_id": user_id}, {"_id": 0})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found. Please sign up first.")
        
        # Security: Compare password (In production, use hashing like bcrypt)
        if user.get("password") != password:
            raise HTTPException(status_code=401, detail="Invalid credentials. Security system rejected access.")
        
        return user
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/signup")
async def signup_endpoint(request: UserContext):
    try:
        users_col, _, _, _ = get_collections()
        # Normalize user_id to ensure consistency
        request.user_id = request.user_id.lower().strip()
        
        # Check if user already exists
        existing = await users_col.find_one({"user_id": request.user_id})
        if existing:
            raise HTTPException(status_code=400, detail="User already exists with this email")
        
        await users_col.insert_one(request.model_dump())
        return {"status": "success", "user": request.model_dump()}
    except Exception as e:
        if isinstance(e, HTTPException): raise e
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

@app.post("/analyze-prescription")
async def analyze_prescription_endpoint(request: PrescriptionAnalysisRequest):
    analysis = agent.analyze_prescription(request.image_data, request.context)
    return {"analysis": analysis}

@app.get("/store")
def get_store_items():
    return [
        {"id": 0, "name": "AroMi Smart Yoga Mat", "price": "₹3,999", "image": "smart-mat.webp", "category": "Bio-Feedback Gear"},
        {"id": 7, "name": "AroMi Hydro Flask", "price": "₹1,499", "image": "hydro-flask.jpg", "category": "Hydration"},
        {"id": 8, "name": "Aromatherapy Diffuser", "price": "₹1,899", "image": "diffuser.jpg", "category": "Relaxation"},
        {"id": 1, "name": "Pure Whey Isolate", "price": "₹4,899", "image": "https://m.media-amazon.com/images/I/718P06p28LL._SL1500_.jpg", "category": "Protein Powder"},
        {"id": 2, "name": "Pre-Workout Matrix", "price": "₹1,899", "image": "https://m.media-amazon.com/images/I/81I-u8tUP5L._SL1500_.jpg", "category": "Fitness Supplement"},
        {"id": 3, "name": "Premium Omega-3", "price": "₹899", "image": "https://m.media-amazon.com/images/I/61kL-u1CxlL._SL1500_.jpg", "category": "Wellness Supplement"},
        {"id": 4, "name": "Daily Multi-Vitamin", "price": "₹699", "image": "https://m.media-amazon.com/images/I/61mOn-qUoFL._SL1500_.jpg", "category": "Wellness Supplement"},
        {"id": 5, "name": "Creatine Monohydrate", "price": "₹1,299", "image": "https://m.media-amazon.com/images/I/61r59uVlqML._SL1000_.jpg", "category": "Fitness Supplement"},
        {"id": 6, "name": "BCAA Energy Hub", "price": "₹1,499", "image": "https://m.media-amazon.com/images/I/71X8k-NqN8L._SL1500_.jpg", "category": "Fitness Supplement"}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
