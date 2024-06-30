import React, { useEffect } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";

export default function UnsafeGetClients({ clients, setClients }) {
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/system/getAllClients"
        );
        if (!response.ok) throw new Error("Error fetching clients");
        const clientsResponse = await response.json();
        setClients(clientsResponse);
        console.log(clientsResponse);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClients();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          Clients
        </Typography>
        <Box
          component="ul"
          sx={{
            listStyleType: "none",
            padding: 0,
            width: "100%",
          }}
        >
          {clients.map((client) => (
            <Paper
              key={client.id}
              sx={{
                padding: 2,
                margin: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body1">{client.fullName}</Typography>
              <Typography variant="body2" color="textSecondary">
                {client.mail}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
