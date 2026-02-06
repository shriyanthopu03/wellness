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
    def connect_db(cls):
        """Connect to MongoDB"""
        mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/aromi_db")
        cls.client = AsyncIOMotorClient(mongodb_uri)
        cls.db = cls.client.get_database()
        print("✓ Connected to MongoDB")

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
