const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/changePassword", userController.changePassword);
router.post("/login", userController.login);
router.post("/forgottenPassword", userController.forgottenPassword);
router.post("/verifytoken", userController.verifyToken);
router.post("/resetpassword", userController.changePasswordWithoutOld);

module.exports = router;
