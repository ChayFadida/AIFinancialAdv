import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { ContactPaper } from "./ContactPaper/ContactPaper";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/contact", formData);
      setSnackbar({
        open: true,
        message: "Message sent successfully!",
        severity: "success",
      });
      // Clear form after successful submission
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to send message. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const isFormValid = !!formData.name && !!formData.email && !!formData.message;

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          Get In Touch
        </Typography>

        <Typography variant="body1" align="center" sx={{ mb: 6 }}>
          We value your feedback and are committed to continuously improving our
          application. Your insights help us push boundaries and deliver the
          best possible experience. Whether you have suggestions, questions, or
          just want to share your thoughts, we're here to listen and grow
          together.
        </Typography>

        <ContactPaper
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isFormValid={isFormValid}
        />
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
