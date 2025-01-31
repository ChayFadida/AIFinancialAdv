import { Box, Avatar, Typography, Paper, useTheme } from "@mui/material";
import { Message } from "../types";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

export const Messages = ({ messages }: { messages: Message[] }) => {
  const theme = useTheme();

  return (
    <>
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent:
              message.sender === "user" ? "flex-end" : "flex-start",
            gap: 1,
            px: 2,
          }}
        >
          {message.sender === "bot" && (
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
          <Box sx={{ maxWidth: "70%" }}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                bgcolor:
                  message.sender === "user"
                    ? theme.palette.primary.main
                    : theme.palette.background.default,
                color:
                  message.sender === "user"
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {message.content}
              </Typography>
            </Paper>
            <Typography
              variant="caption"
              sx={{
                pl: 1,
                color: "text.secondary",
                display: "block",
                mt: 0.5,
              }}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
          {message.sender === "user" && (
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
    </>
  );
};
