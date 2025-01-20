import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
  useTheme,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import { getConversation, sendMessage } from '../../features/chat/api';
interface Message {
  content: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export default function Chatbot() {
  const theme = useTheme();
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);

  useEffect(() => {
    const getConversationMessages = async () => {
      const messagesResponse = await getConversation()

      setMessages(messagesResponse)
    }
    getConversationMessages()
  }, [])

  const messagesEndRef = React.useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = {
        content: input,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');

      try {
        const response = await sendMessage({ question: input })

        setMessages(response);
      } catch (error) {
        console.error('Error communicating with the server:', error);
        setMessages((prev) => [
          ...prev,
          {
            content: 'Sorry, something went wrong. Please try again later.',
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '100%',
        height: 'calc(100vh - 100px)',
        margin: '0 auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          overflow: 'hidden',
        }}
      >
        <CardContent
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            p: '24px !important',
            '&:last-child': { pb: '24px !important' },
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mb: 2,
              height: 0,
              minHeight: 0,
              '&::-webkit-scrollbar': {
                width: '8px',
                borderRadius: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: theme.palette.background.default,
                borderRadius: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme.palette.primary.light,
                borderRadius: '8px',
                '&:hover': {
                  background: theme.palette.primary.main,
                },
              },
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: 1,
                  px: 2,
                }}
              >
                {message.sender === 'bot' && (
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <SmartToyIcon />
                  </Avatar>
                )}
                <Box sx={{ maxWidth: '70%' }}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor:
                        message.sender === 'user'
                          ? theme.palette.primary.main
                          : theme.palette.background.default,
                      color:
                        message.sender === 'user'
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.primary,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{
                      pl: 1,
                      color: 'text.secondary',
                      display: 'block',
                      mt: 0.5,
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
                {message.sender === 'user' && (
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.secondary.main,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                )}
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pt: 2,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
