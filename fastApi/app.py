from fastapi import FastAPI
import uvicorn
from router import askAI
from dependency.dependencies import dependency_container
from config.app_contex import api_title, api_description, api_version, api_docs_url
from fastapi.middleware.cors import CORSMiddleware
import os

# Verify dot env path
env_file_path = os.path.join(os.path.dirname(__file__), '..', '.env')

# Create an instance of the FastAPI class
app = FastAPI(
    title=api_title,
    description=api_description,
    version=api_version,
    docs_url=api_docs_url,      
)



# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs; "*" allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


# Initialize objects globally on startup
agents, tasks = None, None

@app.on_event("startup")
async def startup_event():
    dependency_container.initialize()

# Including all routes
app.include_router(askAI.router)

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
