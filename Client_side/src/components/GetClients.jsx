import React, { useEffect } from "react";
import { Container, Box } from "@mui/material";

export default function GetClients({ clients, setClients }) {
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
  }, [clients]);
  return (
    <Container maxWidth="sm" sx={{ mt: 0 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>Clients</h1>
        <ul>
          {clients.map((client) => (
            <li key={client.id}>{client.fullName}</li>
          ))}
        </ul>
      </Box>
    </Container>
  );
}
