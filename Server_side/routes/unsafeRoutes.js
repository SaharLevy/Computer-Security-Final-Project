const router = require("express").Router();
const unsafeController = require("../controllers/unsafeController");

router.post("/register", unsafeController.register);

module.exports = router;
