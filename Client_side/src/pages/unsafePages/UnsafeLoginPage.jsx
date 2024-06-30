import React, { useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";

export default function UnsafeLoginPage() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/unsafe/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mail, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Login successful.");
        setMail("");
        setPassword("");
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Error: Could not log in.");
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
          Unsafe Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="text" // Change type to text to allow SQL injection testing
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
            Login
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
