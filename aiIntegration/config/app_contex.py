import os

AI_MODEL = os.getenv("AI_MODEL", "llama3.2-vision:11b")
CHAT_BOT_AI_MODEL= os.getenv("AI_MODEL", "0xroyce/plutus:latest")
DB_URL = os.getenv('DB_URL')
DB_NAME='financeAdv'
api_title = "AI-Driven Financial Advisor API"
api_description = """API backend for an AI-driven financial advisor offering personalized stock recommendations. Features endpoints for chatbot interaction, insights from financial reports, and news-based analysis. Simplifies investment decisions with real-time, data-driven strategies."""
api_version = "1.0.0"
api_docs_url = "/docs"