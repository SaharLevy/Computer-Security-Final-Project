import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

export default function ChangePasswordWithoutOldPage() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { mail, token } = location.state || {};

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3001/api/users/resetpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mail, token, newPassword }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("Password changed successfully.");
        setNewPassword("");
        navigate("/login");
      } else {
        setMessage(
          `Error: ${result.errors ? result.errors.join(", ") : result.error}`
        );
      }
    } catch (error) {
      console.error("Error during password change:", error);
      setMessage("Error: Could not change password.");
    }
  };

  if (!mail || !token) {
    return (
      <Typography variant="body1" color="error">
        Invalid request.
      </Typography>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          Change Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, textTransform: "none" }}
          >
            Change Password
          </Button>
        </form>
        {message && (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
