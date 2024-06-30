import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

export default function UnsafeAddClientForm({ onClientAdded }) {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3001/api/unsafe/insertNewClient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName: name, mail }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage(`Client ${result.message} registered successfully.`);
        setName("");
        setMail("");
        onClientAdded(); // Trigger client update
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error during client registration:", error);
      setMessage("Error: Could not register client.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 0 }}>
      <Box
        component={Paper}
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          Add a New Client
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            type="text" // Change type to text to allow SQL injection testing
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, textTransform: "none", width: "auto" }}
          >
            Add Client
          </Button>
        </form>
        {message && (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
