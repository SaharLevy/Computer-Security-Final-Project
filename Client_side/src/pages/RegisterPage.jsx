import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, mail, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(`User ${result.userName} registered successfully.`);
        setUserName("");
        setMail("");
        setPassword("");
        setErrors([]);
      } else {
        setErrors(result.errors || ["An error occurred."]);
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors(["Error: Could not register user."]);
      setSuccessMessage("");
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
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
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
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Register
          </Button>
        </form>
        {successMessage && (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            {successMessage}
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
