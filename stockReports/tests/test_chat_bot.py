import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from app import app

client = TestClient(app)

@patch('chatBot.chat.get_chatbot_chain')
@patch('chatBot.chat.ChatOllama.invoke')  # Mocking the invoke method of ChatOllama
def test_chat_endpoint(mock_invoke, mock_get_chatbot_chain):
    # Mock the invoke method to return a predefined response
    mock_invoke.return_value = MagicMock(content="hello world")
    
    # Mock the get_chatbot_chain to return a chain that uses the mocked invoke method
    mock_chain = MagicMock()
    mock_chain.invoke = mock_invoke
    mock_get_chatbot_chain.return_value = mock_chain
    
    # Prepare the request data
    request_data = {
        "history": [
            {"role": "user", "content": "What is AI?"}
        ],
        "question": "Tell me about machine learning."
    }
    
    # Make the POST request to the chat endpoint
    response = client.post("/financialChatBot/chat", json=request_data)
    
    response_json = response.json()

    # Assert the status code is 200
    assert response.status_code == 200
    assert 'history' in response_json
    assert 'question' in response_json
    assert 'answer' in response_json
    assert response_json['answer'] == "hello world"



def test_chat_invalid_request():
    # Test for invalid input (missing question)
    response = client.post(
        "/financialChatBot/chat",
        json={"question": ""}
    )
    assert response.status_code == 422


@patch('chatBot.chat.get_chatbot_chain')
@patch('chatBot.chat.ChatOllama.invoke')
def test_chat_unexpected_error(mock_invoke, mock_get_chatbot_chain):
    # Simulate an unexpected error by raising an exception in the invoke method
    mock_invoke.side_effect = Exception("Unexpected error occurred")
    
    # Prepare the request data
    request_data = {
        "history": [
            {"role": "user", "content": "What is AI?"}
        ],
        "question": "Tell me about machine learning."
    }
    
    # Make the POST request to the chat endpoint
    response = client.post("/financialChatBot/chat", json=request_data)

    # Assert the status code is 500 (Internal Server Error)
    assert response.status_code == 500
    assert response.json() == {"detail": "Unexpected error occurred"}

