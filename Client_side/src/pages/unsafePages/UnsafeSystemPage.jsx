import React, { useState, useEffect } from "react";
import UnsafeAddClientForm from "../../components/unsafeComponents/UnsafeAddClientForm";
import UnsafeGetClients from "../../components/unsafeComponents/UnsafeGetClients";

const UnsafeSystemPage = () => {
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
      <UnsafeAddClientForm onClientAdded={handleClientAdded} />
      <UnsafeGetClients clients={clients} />
    </>
  );
};

export default UnsafeSystemPage;
