const express = require("express");
const mysql = require("mysql2");
const userRoutes = require("./routes/userRoutes");
const sequelize = require("./models/index");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT;

console.log("Starting server...");
console.log(process.env.DB_USERNAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);
console.log(process.env.DB_HOST);
console.log(process.env.DB_DIALECT);
console.log("Hello World");

app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(port, async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sync models with the database
    await sequelize.sync();

    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
