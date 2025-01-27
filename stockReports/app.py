from dotenv import load_dotenv
import os
env_file_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(override=True)
from fastapi import FastAPI
import uvicorn
from router import stocks_reports, chat_bot
from config.app_contex import api_title, api_description, api_version, api_docs_url
from fastapi.middleware.cors import CORSMiddleware
from crewAI.analyze_reports import ReportGeneration
from utils.types.report_types import ReportType

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

# Including all routes
app.include_router(stocks_reports.router)
app.include_router(chat_bot.router)

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
