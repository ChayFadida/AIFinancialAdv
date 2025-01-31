import { Paper, TextField, Button } from "@mui/material";

interface ContactPaperProps {
  formData: {
    name: string;
    email: string;
    message: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isFormValid: boolean;
}

export const ContactPaper = ({
  formData,
  handleChange,
  handleSubmit,
  isFormValid,
}: ContactPaperProps) => {
  return (
    <Paper elevation={3} sx={{ p: 4, border: "0.5px solid white" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          label="Message"
          name="message"
          multiline
          rows={4}
          value={formData.message}
          onChange={handleChange}
          required
          sx={{ mb: 4 }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={!isFormValid}
          sx={{
            py: 1.5,
            fontSize: "1.1rem",
          }}
        >
          Send Message
        </Button>
      </form>
    </Paper>
  );
};
