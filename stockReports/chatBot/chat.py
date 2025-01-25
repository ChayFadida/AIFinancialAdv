from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel
from typing import List, Dict
from config.app_contex import AI_MODEL
from utils.prompts.prompts import chat_bot_template
class ChatRequest(BaseModel):
    history: List[Dict[str, str]]  # Each entry has "role" ("user" or "chat") and "content"
    question: str


llm = ChatOllama(model=AI_MODEL)
prompt = ChatPromptTemplate.from_template(chat_bot_template)

def get_chatbot_chain():
    return prompt | llm

def process_history(history: List[Dict[str, str]], new_entry: Dict[str, str]) -> List[Dict[str, str]]:
    """
    Add a new entry to the history and return the latest 10 items.

    Args:
        history: The current chat history.
        new_entry: The latest entry to append (e.g., {"role": "user", "content": "question"}).

    Returns:
        A list containing the latest 10 history items.
    """
    updated_history = history + [new_entry]
    return updated_history[-10:]  # Keep only the last 10 items
