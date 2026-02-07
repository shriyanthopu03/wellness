"""
Database connection module for MongoDB
"""
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None

    @classmethod
    async def connect_db(cls):
        """Connect to MongoDB"""
        # Try both common names for MongoDB URI
        mongodb_uri = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI") or "mongodb://localhost:27017/aromi_db"
        
        try:
            cls.client = AsyncIOMotorClient(mongodb_uri, serverSelectionTimeoutMS=5000)
            
            # Use 'aromi_db' if no database is specified in the URI
            db_name = mongodb_uri.split("/")[-1].split("?")[0]
            if not db_name:
                cls.db = cls.client.get_database("aromi_db")
            else:
                cls.db = cls.client.get_database()
                
            # Verify connection
            await cls.client.admin.command('ping')
            print(f"✓ Connected to MongoDB Database: {cls.db.name}")
        except Exception as e:
            print(f"✗ MongoDB Connection Error: {e}")
            raise e

    @classmethod
    def close_db(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            print("✓ Disconnected from MongoDB")

    @classmethod
    def get_db(cls) -> AsyncIOMotorDatabase:
        """Get database instance"""
        return cls.db

# Get database instance
def get_database() -> AsyncIOMotorDatabase:
    return Database.get_db()
