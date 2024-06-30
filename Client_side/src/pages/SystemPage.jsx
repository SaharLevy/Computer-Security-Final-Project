import React, { useState, useEffect } from "react";
import AddClientForm from "../components/AddClientForm";
import GetClients from "../components/GetClients";

const SystemPage = () => {
  const [clients, setClients] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleClientAdded = () => {
    setUpdateTrigger(updateTrigger + 1);
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/system/getAllClients"
        );
        if (!response.ok) throw new Error("Error fetching clients");
        const clientsResponse = await response.json();
        setClients(clientsResponse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClients();
  }, [updateTrigger]);

  return (
    <>
      <AddClientForm onClientAdded={handleClientAdded} />
      <GetClients clients={clients} />
    </>
  );
};

export default SystemPage;
