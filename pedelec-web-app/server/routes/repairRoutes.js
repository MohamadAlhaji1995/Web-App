const express = require("express");
const router = express.Router();
const {
  createReparaturAnfrage,
  getAllReparaturAnfragen,
  updateReparaturStatus,
  deleteReparaturAnfrage,
} = require("../controllers/repairController");

router.post("/reparatur-anfrage", createReparaturAnfrage);
router.get("/reparatur-anfrage", getAllReparaturAnfragen);
router.put("/reparatur-anfrage/:id", updateReparaturStatus);
router.delete("/reparatur-anfrage/:id", deleteReparaturAnfrage);

module.exports = router;
