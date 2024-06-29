import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

export default function ChangePasswordPage() {
  const [mail, setMail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3001/api/users/changePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mail, oldPassword, newPassword }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("Password changed successfully.");
        setErrors([]);
        setMail("");
        setOldPassword("");
        setNewPassword("");
      } else {
        setErrors(result.errors || ["An error occurred."]);
        setMessage("");
      }
    } catch (error) {
      console.error("Error during password change:", error);
      setErrors(["Error: Could not change password."]);
      setMessage("");
    }
  };

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
            label="Email"
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Old Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
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
        {errors.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {errors.map((error, index) => (
              <Typography key={index} variant="body1" color="error">
                {error}
              </Typography>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
}
