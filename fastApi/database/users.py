from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
from fastapi import HTTPException
from datetime import datetime  # Import datetime directly

class UserHandler:
    def __init__(self, db):
        self.users = db.get_users_collection()

    def get_user_by_username(self, username: str):
        """Find a user by username"""
        return self.users.find_one({"username": username})

    def create_user(self, username: str, hashed_password: str, role: str, status: str):
        """Register a new user"""
        user_data = {
            "username": username,
            "password": hashed_password,  # Store the hashed password
            "role": role,
            "status": status,  # E.g., 'pending', 'approved'
            "created_at": datetime.utcnow(),
        }
        try:
            self.users.insert_one(user_data)
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="User already exists")

    def update_user_status(self, user: dict, new_status: str):
        """Update a user's status (e.g., approving a user)"""
        self.users.update_one({"_id": ObjectId(user['_id'])}, {"$set": {"status": new_status}})

    def delete_user(self, username: str):
        """Delete a user"""
        self.users.delete_one({"username": username})
