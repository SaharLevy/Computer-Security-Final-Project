import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

export default function ForgottenPasswordPage() {
  const [mail, setMail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmitEmail = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3001/api/users/forgottenPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mail }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("A reset token has been sent to your email.");
        setStep(2);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
      setMessage("Error: Could not request password reset.");
    }
  };

  const handleSubmitToken = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3001/api/users/verifyToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mail, token }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        navigate("/resetpassword", { state: { mail, token } });
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error during token verification:", error);
      setMessage("Error: Could not verify token.");
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
          {step === 1 ? "Forgotten Password" : "Enter Token"}
        </Typography>
        {step === 1 ? (
          <form onSubmit={handleSubmitEmail}>
            <TextField
              label="Email"
              type="email"
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
              fullWidth
              sx={{ mt: 2, textTransform: "none" }}
            >
              Send Reset Token
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmitToken}>
            <TextField
              label="Reset Token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
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
              Verify Token
            </Button>
          </form>
        )}
        {message && (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
