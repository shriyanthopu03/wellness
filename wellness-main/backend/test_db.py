import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def test_connection():
    uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/aromi_db")
    print(f"Connecting to: {uri}...")
    try:
        client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=2000)
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        print("✅ Successfully connected to MongoDB!")
        
        db = client.get_database()
        print(f"Using database: {db.name}")
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\nPossible solutions:")
        print("1. Ensure MongoDB is installed and running locally.")
        print("2. If using MongoDB Atlas, update MONGODB_URI in .env with your connection string.")
        print("3. Check if your firewall is blocking port 27017.")

if __name__ == "__main__":
    asyncio.run(test_connection())
