import { useState } from 'react';
import { Container, TextInput, Button, Group, Paper, Text, ScrollArea } from '@mantine/core';

export function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    // Add user message to the chat
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send user message to the backend
      const response = await fetch(`http://localhost:8000/askAI/?question=${encodeURIComponent(input)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bot response');
      }

      const data = await response.json();

      const botMessage = { sender: 'bot', text: data.response };
      
      // Add bot response to the chat
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    }

    // Clear input field
    setInput('');
  };

  return (
    <Container size="xl" style={{ marginTop: '2rem' }}>
      <Paper shadow="xl" padding="md">
        <ScrollArea style={{ height: 400, marginBottom: '1rem' }}>
          {messages.map((msg, index) => (
            <Text key={index} align={'left'} color={msg.sender === 'user' ? 'blue' : 'black'} style={{ marginBottom: '0.5rem' }}>
              <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
            </Text>
          ))}
        </ScrollArea>
        <Group>
          <TextInput
            placeholder="Type your message"
            value={input}
            onChange={(event) => setInput(event.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </Group>
      </Paper>
    </Container>
  );
}