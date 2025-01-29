from pymongo import MongoClient
import certifi
class Database:
    def __init__(self, uri: str, db_name: str):
        # Replace with your MongoDB URI and database name
        self.client = MongoClient(uri, tlsCAFile=certifi.where())
        self.db = self.client[db_name]

    def get_collection(self, collection_name: str):
        return self.db[collection_name]