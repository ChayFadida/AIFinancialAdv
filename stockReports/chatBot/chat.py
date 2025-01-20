from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel
from typing import List, Dict

class ChatRequest(BaseModel):
    history: List[Dict[str, str]]  # Each entry has "role" ("user" or "chat") and "content"
    question: str


chat_bot_template = """
    You are a financial expert specializing in providing advice to middle-class working families. Use your expertise to answer the question below.
    This is the conversation history: {history}

    Question: {question}

    Answer:
"""

llm = ChatOllama(model="llama3.2-vision:11b")
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
