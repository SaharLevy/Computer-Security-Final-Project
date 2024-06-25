const { Client } = require("../models");

exports.insertNewClient = async (req, res) => {
  const { fullName, mail } = req.body;

  try {
    // Check if client exists
    const client = await Client.findOne({ where: { mail } });
    if (client) {
      return res.status(400).json({ error: "Client already exists." });
    }
    const newClient = await Client.create({ fullName, mail });
    res.status(201).json({ message: `${fullName} registered successfully.` });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error during fetching clients:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
