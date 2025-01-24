import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { useTheme } from "@mui/material/styles";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../../features/auth/api";
import { appStorage } from "../../services/appStorage";
import { useUser } from "../../context";

export function Register() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { handleUser } = useUser();

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    stocks: "",
  });
  const [error, setError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({ ...formData, [name]: value });

    // Real-time password validation
    if (name === "password" || name === "confirmPassword") {
      if (formData.password !== value && name === "confirmPassword") {
        setPasswordError("Passwords do not match");
      } else if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters long");
      } else {
        setPasswordError(""); // Clear password errors
      }
    }
  };

  // Validate email and other inputs
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email address");
      return false;
    }
    if (
      passwordError ||
      formData.password !== formData.confirmPassword ||
      formData.password.length < 6
    ) {
      setError("Passwords do not match or are too short");
      return false;
    }
    setError("");
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return;

    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password, // Password sent as plain text, hash on the backend
        stocks: formData.stocks, // Stocks as a comma-separated string
      });

      if (user.id) {
        appStorage.setToken(user.token);
        handleUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error registering user:", err);
      setError("Failed to register user. Please try again later.");
    }
  };

  return (
    <AppProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#121212",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              width: 400,
              padding: 4,
              backgroundColor: "#1e1e1e",
              borderRadius: 2,
              boxShadow: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, color: "white" }}>
              Register
            </Typography>
            <TextField
              label="Name"
              name="name"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={formData.email}
              onChange={handleChange}
              error={!!error && error.includes("email")}
              helperText={error && error.includes("email") ? error : ""}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={formData.password}
              onChange={handleChange}
              error={!!passwordError}
              helperText={passwordError}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!passwordError}
              helperText={passwordError}
            />
            <TextField
              label="Stocks to follow (separate with a ',')"
              name="stocks"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={formData.stocks}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
              type="submit"
            >
              Register
            </Button>
            <Button
              variant="text"
              color="secondary"
              fullWidth
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>
          </Box>
        </form>
        {/* Snackbar for Success */}
        {successMessage && (
          <Snackbar
            open={!!successMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessMessage("")}
          >
            <Alert severity="success" sx={{ width: "100%" }}>
              {successMessage}
            </Alert>
          </Snackbar>
        )}

        {/* Snackbar for Errors */}
        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={3000}
            onClose={() => setError("")}
          >
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          </Snackbar>
        )}
      </Box>
    </AppProvider>
  );
}
