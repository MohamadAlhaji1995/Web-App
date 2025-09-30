//Route für das Abrufen von Benutzerdaten.

const express = require("express");
const {
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", [authMiddleware, adminMiddleware], getUsers); // Nur Admins können alle Benutzer sehen
router.put("/:id", [authMiddleware, adminMiddleware], updateUser); // Benutzer bearbeiten
router.delete("/:id", [authMiddleware, adminMiddleware], deleteUser); // Benutzer löschen

module.exports = router;
