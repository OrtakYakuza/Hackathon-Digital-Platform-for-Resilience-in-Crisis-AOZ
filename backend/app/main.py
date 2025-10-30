from fastapi import FastAPI
from pymongo import MongoClient
import os

# Create FastAPI app
app = FastAPI(title="AOZ Supply Coordination Backend")

# --- Database connections ---
# MongoDB connection
mongo_url = os.getenv("MONGO_URL", "mongodb://root:example@mongo:27017/")
client = MongoClient(mongo_url)
db = client["aoz_db"]

# --- Routes ---
@app.get("/")
def root():
    """Health check route"""
    return {"status": "ok", "message": "Backend running successfully"}

@app.get("/mongo/test")
def test_mongo():
    """Check if MongoDB connection works"""
    try:
        db.list_collection_names()
        return {"mongo": "connected"}
    except Exception as e:
        return {"mongo": "connection failed", "error": str(e)}

@app.get("/items")
def get_items():
    """Example route: list all items from a collection"""
    items = list(db.items.find({}, {"_id": 0}))  # return all without MongoDB _id field
    return {"items": items}

@app.post("/items")
def add_item(item: dict):
    """Example route: add a new item to Mongo"""
    db.items.insert_one(item)
    return {"status": "inserted", "item": item}
