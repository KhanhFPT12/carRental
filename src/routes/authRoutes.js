const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Pages
router.get("/login", authController.loginPage);
router.get("/register", authController.registerPage);

// Actions
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;