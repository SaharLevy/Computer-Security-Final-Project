const router = require("express").Router();
const systemController = require("../controllers/systemController");

router.post("/insertNewClient", systemController.insertNewClient);
router.get("/getAllClients", systemController.getAllClients);

module.exports = router;
