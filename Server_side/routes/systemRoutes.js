const router = require("express").Router();
const systemController = require("../controllers/systemController");

router.post("/insertNewClient", systemController.insertNewClient);

module.exports = router;
