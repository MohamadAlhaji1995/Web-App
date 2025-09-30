// Routen für die Registrierung, Anmeldung und das Abrufen aller Benutzer
const express = require("express");
const { register, logIn } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/logIn", logIn);

module.exports = router;
