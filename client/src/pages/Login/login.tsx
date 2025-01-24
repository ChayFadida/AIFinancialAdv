import * as React from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/auth/api";
import { useUser } from "../../context";
import { appStorage } from "../../services/appStorage";

export function Login() {
  const { handleUser } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle login submission

  const handleSignIn = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const user = await login(formData);

      if (user.id) {
        appStorage.setToken(user.token);
        handleUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Failed to log in. Please try again later.");
    }
  };

  return (
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
      <form onSubmit={handleSignIn}>
        {/* Sign-in Card */}
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
          {/* Header */}
          <Typography variant="h5" sx={{ mb: 1, color: "white" }}>
            Sign in
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "gray" }}>
            Welcome, please sign in to continue
          </Typography>

          {/* Email Field */}
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />

          {/* Password Field */}
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={formData.password}
            onChange={handleChange}
          />

          {/* Remember Me */}
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
            }
            label="Remember me"
            sx={{ color: "white", mb: 2 }}
          />

          {/* Sign-In Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 3 }}
            type="submit"
          >
            Sign In
          </Button>

          {/* Register Section */}
          <Typography variant="body2" sx={{ mb: 1, color: "white" }}>
            Not a member yet? Register now:
          </Typography>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Box>
      </form>
      {/* Snackbar for Error */}
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
  );
}
