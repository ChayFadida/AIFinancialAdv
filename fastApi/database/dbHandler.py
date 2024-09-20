from pymongo import MongoClient
from bson.objectid import ObjectId
import os
import certifi
class DBHandler:
    def __init__(self):
        # Replace with your MongoDB URI and database name
        self.client = MongoClient("mongodb+srv://username:password@financeproject.72sw5.mongodb.net/?retryWrites=true&w=majority&appName=financeProject", tlsCAFile=certifi.where())
        self.db = self.client['financeAdv']

    def get_users_collection(self):
        return self.db['users']

    def close(self):
        self.client.close()
