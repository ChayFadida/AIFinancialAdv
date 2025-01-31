import { Box, Button, TextField } from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  onSubmit: (e: React.FormEvent) => void;
  input: string;
  setInput: (input: string) => void;
}

export const ChatInput = ({ onSubmit, input, setInput }: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
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
          endIcon={<SendIcon />}
          type="submit"
        >
          Send
        </Button>
      </Box>
    </form>
  );
};
