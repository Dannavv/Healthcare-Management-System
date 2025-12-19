from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

# 👇 Explicit database name
db = client["healthcare_db"]

users = db["users"]
patients = db["patients"]
doctors = db["doctors"]
