const router = require("express").Router();
const unsafeController = require("../controllers/unsafeController");

router.post("/register", unsafeController.register);
router.post("/login", unsafeController.login);
router.post("/insertNewClient", unsafeController.insertNewClient);

module.exports = router;
