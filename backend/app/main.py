from bson import ObjectId
from fastapi import FastAPI
from pymongo import MongoClient
import os
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict
from fastapi import Query


# --- Database connections ---
# MongoDB connection
mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
client = MongoClient("mongodb://root:example@localhost:27017/")
db = client["aoz_db"]
users_collection = db["users"]


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


# --- Routes ---

@app.get("/items/by_location")
def get_items_by_location(location: str = Query(..., description="e.g. loc_centrum")):
    """
    Return stock for a single location, grouped by category and item name.
    Example: bedding -> Bett / Kissen / Decke / Schlafsack with counts.
    """
    cursor = db.items.find({"location": location}, {"_id": 0})

    # structure:
    # categories["bedding"] = { "Bett": {"available": 0, "reserved": 0} , ... }
    categories = defaultdict(lambda: defaultdict(lambda: {"available": 0, "reserved": 0}))

    for doc in cursor:
        cat = doc.get("category", "unknown")
        item_name = doc.get("name", "unknown")
        status = doc.get("status", "available")
        if status not in ["available", "reserved"]:
            status = "available"
        categories[cat][item_name][status] += 1

    # convert that defaultdict mess into clean arrays for frontend
    result_categories = {}
    for cat, items in categories.items():
        result_categories[cat] = []
        for item_name, counts in items.items():
            available = counts["available"]
            reserved = counts["reserved"]
            total = available + reserved
            result_categories[cat].append(
                {
                    "name": item_name,
                    "available": available,
                    "reserved": reserved,
                    "total": total,
                }
            )

    return {
        "location": location,
        "categories": result_categories,
    }

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

# NEW SAMPLE
sample_items = [
    { "name": "Bett", "category": "bedding", "status": "available", "location": "loc_centrum"},
    {"name": "Bett", "category": "bedding", "status": "available", "location": "loc_west"},
    {"name": "Bett", "category": "bedding", "status": "reserved", "location": "loc_altstetten"},
    {"name": "Bett", "category": "bedding", "status": "reserved", "location": "loc_oerlikon"},
    {"name": "Bett", "category": "bedding", "status": "available", "location": "loc_centrum"},
    {"name": "Bett", "category": "bedding", "status": "available", "location": "loc_west"},
    {"name": "Bett", "category": "bedding", "status": "reserved", "location": "loc_altstetten"},
    {"name": "Bett", "category": "bedding", "status": "available", "location": "loc_oerlikon"},
    {"name": "Bett", "category": "bedding", "status": "available", "location": "loc_zuerichwest"},
    {"name": "Bett", "category": "bedding", "status": "available", "location": "loc_centrum"},

    {"name": "Decke", "category": "bedding", "status": "available", "location": "loc_centrum"},
    {"name": "Decke", "category": "bedding", "status": "reserved", "location": "loc_altstetten"},
    {"name": "Decke", "category": "bedding", "status": "available", "location": "loc_oerlikon"},
    {"name": "Decke", "category": "bedding", "status": "available", "location": "loc_west"},
    {"name": "Decke", "category": "bedding", "status": "reserved", "location": "loc_centrum"},
    {"name": "Decke", "category": "bedding", "status": "available", "location": "loc_zuerichwest"},
    {"name": "Decke", "category": "bedding", "status": "available", "location": "loc_west"},
    {"name": "Decke", "category": "bedding", "status": "reserved", "location": "loc_oerlikon"},
    {"name": "Decke", "category": "bedding", "status": "available", "location": "loc_altstetten"},
    {"name": "Decke", "category": "bedding", "status": "available", "location": "loc_centrum"},

    {"name": "Kissen", "category": "bedding", "status": "available", "location": "loc_west"},
    {"name": "Kissen", "category": "bedding", "status": "available", "location": "loc_centrum"},
    {"name": "Kissen", "category": "bedding", "status": "reserved", "location": "loc_oerlikon"},
    {"name": "Kissen", "category": "bedding", "status": "available", "location": "loc_zuerichwest"},
    {"name": "Kissen", "category": "bedding", "status": "available", "location": "loc_altstetten"},
    {"name": "Kissen", "category": "bedding", "status": "available", "location": "loc_centrum"},
    {"name": "Kissen", "category": "bedding", "status": "reserved", "location": "loc_west"},
    {"name": "Kissen", "category": "bedding", "status": "available", "location": "loc_oerlikon"},
    {"name": "Kissen", "category": "bedding", "status": "available", "location": "loc_altstetten"},
    {"name": "Kissen", "category": "bedding", "status": "reserved", "location": "loc_centrum"},

    {"name": "Schlafsack", "category": "bedding", "status": "available", "location": "loc_altstetten"},
    {"name": "Schlafsack", "category": "bedding", "status": "available", "location": "loc_oerlikon"},
    {"name": "Schlafsack", "category": "bedding", "status": "available", "location": "loc_centrum"},
    {"name": "Schlafsack", "category": "bedding", "status": "reserved", "location": "loc_west"},
    {"name": "Schlafsack", "category": "bedding", "status": "reserved", "location": "loc_zuerichwest"},
    {"name": "Schlafsack", "category": "bedding", "status": "available", "location": "loc_altstetten"},
    {"name": "Schlafsack", "category": "bedding", "status": "available", "location": "loc_oerlikon"},
    {"name": "Schlafsack", "category": "bedding", "status": "available", "location": "loc_centrum"},
    {"name": "Schlafsack", "category": "bedding", "status": "available", "location": "loc_zuerichwest"},
    {"name": "Schlafsack", "category": "bedding", "status": "reserved", "location": "loc_west"},
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

@app.get("/mongo/test")
def test_mongo():
    """Check if MongoDB connection works"""
    try:
        db.list_collection_names()
        return {"mongo": "connected"}
    except Exception as e:
        return {"mongo": "connection failed", "error": str(e)}


# Helper function to convert MongoDB document to dict
def user_to_dict(doc):
    return {
        "id": str(doc["_id"]),
        "firstName": doc.get("firstName", ""),
        "lastName": doc.get("lastName", ""),
        "email": doc.get("email", ""),
        "status": doc.get("status", ""),
        "role": doc.get("role", ""),
        "comments": doc.get("comments", "")
    }

@app.get("/users")
def get_users():
    users = users_collection.find()
    return [user_to_dict(u) for u in users]

@app.get("/users/{user_id}")
def get_user(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return {}
    return user_to_dict(user)

@app.put("/users/{user_id}")
def update_user(user_id: str, user_data: dict):
    users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": user_data})
    updated_user = users_collection.find_one({"_id": ObjectId(user_id)})
    return user_to_dict(updated_user)

@app.post("/users")
def create_user(user_data: dict):
    result = users_collection.insert_one(user_data)
    new_user = users_collection.find_one({"_id": result.inserted_id})
    return user_to_dict(new_user)

@app.delete("/users/{user_id}")
def delete_user(user_id: str):
    users_collection.delete_one({"_id": ObjectId(user_id)})
    return {"message": "Benutzer gelöscht"}

@app.post("/users/populate")
def populate_users():
    users_collection.delete_many({})  # clear existing data
    users_collection.insert_many(sample_users)
    return {"status": "inserted sample users", "count": len(sample_users)}

sample_users = [
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "status": "Aktiv",
  "role": "Mitarbeiter",
  "comments": "Kriese 1, Kreis 3"
},
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "status": "Aktiv",
  "role": "Admin",
  "comments": ""
},
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice@example.com",
  "status": "Deaktiviert",
  "role": "Wartung",
  "comments": ""
},
{
  "firstName": "Armon",
  "lastName": "Joy",
  "email": "armon@example.com",
  "status": "Aktiv",
  "role": "Vorsitzender",
  "comments": "Teamleiterin Kriese 1"
},
]
@app.get("/items/bedding")
def get_bedding():
    """Return total count of bedding items by type (no status differentiation)"""
    pipeline = [
        {"$match": {"category": "bedding"}},
        {
            "$group": {
                "_id": "$name",
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]

    result = list(db.items.aggregate(pipeline))
    # Convert MongoDB aggregation output into a simple dictionary
    summary = {item["_id"]: item["count"] for item in result}

    return {"bedding_summary": summary}

@app.get("/items/bedding/{item_name}")
def get_bedding_item_detail(item_name: str):
    # Fetch all items in the bedding category with that name
    cursor = db.items.find({"category": "bedding", "name": item_name})
    items = list(cursor)

    if not items:
        return {"error": "Item not found"}

    total_count = len(items)
    available_count = sum(1 for i in items if i.get("status") == "available")
    reserved_count = sum(1 for i in items if i.get("status") == "reserved")

    # Count per location
    per_location = defaultdict(lambda: {"overall": 0, "available": 0, "reserved": 0})
    for item in items:
        loc = item.get("location", "unknown")
        per_location[loc]["overall"] += 1
        if item.get("status") == "available":
            per_location[loc]["available"] += 1
        elif item.get("status") == "reserved":
            per_location[loc]["reserved"] += 1

    # Convert defaultdict to regular dict
    per_location = dict(per_location)

    # You can store descriptions in Mongo, but here’s an example fallback:
    description_map = {
        "Bett": "80 cm breites, faltbares Feldbett für Flüchtlingsunterkünfte",
        "Decke": "Warme Wolldecke, geeignet für kalte Nächte",
        "Kissen": "Weiches Kopfkissen aus Baumwolle",
        "Schlafsack": "Leichter Schlafsack für den Notfalleinsatz",
    }

    description = description_map.get(item_name, "Keine Beschreibung verfügbar.")

    return {
        "name": item_name,
        "description": description,
        "overall": total_count,
        "available": available_count,
        "reserved": reserved_count,
        "per_location": per_location,
    }
