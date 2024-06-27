import AddClientForm from "../components/AddClientForm";
import { useState } from "react";
import GetClients from "../components/GetClients";

const SystemPage = () => {
  const [clients, setClients] = useState([]);
  console.log("Clients in SystemPage:", clients);

  return (
    <>
      <AddClientForm />
      <GetClients clients={clients} setClients={setClients} />
    </>
  );
};

export default SystemPage;
