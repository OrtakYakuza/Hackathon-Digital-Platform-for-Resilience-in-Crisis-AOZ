from fastapi import FastAPI
from pymongo import MongoClient
import os
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app
app = FastAPI(title="AOZ Supply Coordination Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://127.0.0.1:3000",  # sometimes browsers resolve to 127.0.0.1
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database connections ---
# MongoDB connection
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
client = MongoClient("mongodb://localhost:27017/")
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
    print("get items called")
    items = list(db.items.find({}, {"_id": 0}))  # return all without MongoDB _id field
    print(items)
    return {"items": items}

@app.post("/items")
def add_item(item: dict):
    """Example route: add a new item to Mongo"""
    db.items.insert_one(item)
    return {"status": "inserted", "item": item}

@app.get("/locations")
def get_locations():
    """List all locations"""
    locations = list(db.locations.find({}, {"_id": 0}))
    return {"locations": locations}

# Sample hierarchical dataset
sample_items = [
    # Food
    {"category": "food", "name": "Apple", "weight": 0.2, "price": 0.5, "stock": 50},
    {"category": "food", "name": "Banana", "weight": 0.25, "price": 0.3, "stock": 100},
    {"category": "food", "name": "Bread", "weight": 0.5, "price": 2.0, "stock": 20},
    
    # Bedding
    {"category": "bedding", "name": "Bed", "size": "queen", "material": "wood", "stock": 5},
    {"category": "bedding", "name": "Blanket", "size": "double", "material": "wool", "stock": 15},
    {"category": "bedding", "name": "Pillow", "size": "standard", "material": "feather", "stock": 25}, 
    
    # Hygiene
    {"category": "hygiene", "name": "Soap", "weight": 0.1, "price": 1.0, "stock": 50},
    {"category": "hygiene", "name": "Shampoo", "volume": 0.5, "price": 3.0, "stock": 30},
    {"category": "hygiene", "name": "Toothbrush", "size": "medium", "material": "plastic", "stock": 40},
]

# Route to populate MongoDB
@app.post("/items/populate")
def populate_items():
    """Populate MongoDB with structured sample items"""
    db.items.delete_many({})  # clear existing data
    db.items.insert_many(sample_items)
    return {"status": "inserted sample items", "count": len(sample_items)}

# Sample locations dataset
sample_locations = [
    {
        "name": "AOZ Central Warehouse",
        "address": "Bahnhofstrasse 10",
        "postal_code": "8001"
    },
    {
        "name": "AOZ Food Hub",
        "address": "Sihlstrasse 15",
        "postal_code": "8005"
    },
    {
        "name": "AOZ Bedding Center",
        "address": "Europaallee 20",
        "postal_code": "8004"
    },
    {
        "name": "AOZ Hygiene Depot",
        "address": "Werdstrasse 35",
        "postal_code": "8002"
    },
    {
        "name": "AOZ Outlet Zürich West",
        "address": "Pfingstweidstrasse 100",
        "postal_code": "8005"
    },
]

# Route to populate locations
@app.post("/locations/populate")
def populate_locations():
    """Populate MongoDB with sample locations"""
    db.locations.delete_many({})  # clear existing data
    db.locations.insert_many(sample_locations)
    return {"status": "inserted sample locations", "count": len(sample_locations)}
