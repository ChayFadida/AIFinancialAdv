import React, { useEffect } from "react";
import { Box, Card, CardContent, useTheme } from "@mui/material";
import { getConversation, sendMessage } from "../../features/chat/api";
import { Messages } from "./Messages/Messages";
import { Message } from "./types";
import { ChatInput } from "./ChatInput/ChatInput";

export default function Chatbot() {
  const theme = useTheme();
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);

  useEffect(() => {
    const getConversationMessages = async () => {
      try {
        const messagesResponse = await getConversation();

        setMessages(messagesResponse);
      } catch (err) {
        console.error(err);
      }
    };
    getConversationMessages();
  }, []);

  const messagesEndRef = React.useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage: Message = {
        content: input,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      try {
        const response = await sendMessage({ question: input });

        setMessages(response);
      } catch (error) {
        console.error("Error communicating with the server:", error);
        setMessages((prev) => [
          ...prev,
          {
            content: "Sorry, something went wrong. Please try again later.",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 100px)",
        margin: "0 auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            p: "24px !important",
            "&:last-child": { pb: "24px !important" },
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: 2,
              height: 0,
              minHeight: 0,
              "&::-webkit-scrollbar": {
                width: "8px",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: theme.palette.background.default,
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: theme.palette.primary.light,
                borderRadius: "8px",
                "&:hover": {
                  background: theme.palette.primary.main,
                },
              },
            }}
          >
            <Messages messages={messages} />
            <div ref={messagesEndRef} />
          </Box>
          <ChatInput onSubmit={handleSend} input={input} setInput={setInput} />
        </CardContent>
      </Card>
    </Box>
  );
}
