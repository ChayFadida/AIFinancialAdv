from fastapi import APIRouter, Query, HTTPException, Depends
from chatBot.chat import ChatRequest, get_chatbot_chain, process_history
from langchain_core.prompts import ChatPromptTemplate

router = APIRouter(prefix="/financialChatBot", tags=["Financial Chat Bot"])

@router.post("/chat")
async def chat_endpoint(
    request: ChatRequest, 
    chain: ChatPromptTemplate = Depends(get_chatbot_chain)):
    try:
        # Prepare history with the new question
        new_entry = {"role": "user", "content": request.question}
        updated_history = process_history(request.history, new_entry)

        # Process the chat request using LangChain
        response = chain.invoke({
            "history": [{"role": h["role"], "content": h["content"]} for h in updated_history],
            "question": request.question
        })
        
        # Add chatbot's response to the history
        updated_history = process_history(
            updated_history, {"role": "chat", "content": response.content}
        )
        
        # Return response with the updated history
        return {
            "history": updated_history,
            "question": request.question,
            "answer": response.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
