const express = require("express");
//const mysql = require("mysql2");
const userRoutes = require("./routes/userRoutes");
//const sequelize = require("./models/index");
const dotenv = require("dotenv");
const db = require("./models");

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/users", userRoutes);

db.sequelize.sync().then((req) => {
  app.listen(port, async () => {
    try {
      // Test the database connection
      //await sequelize.authenticate();
      console.log("Connection has been established successfully.");

      // Sync models with the database
      //await sequelize.sync();

      console.log(`Server is running on port ${port}`);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  });
});
