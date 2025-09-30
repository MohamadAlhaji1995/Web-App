//Routen für das Hinzufügen, Abrufen und Löschen von E-Bikes
const express = require("express");
const router = express.Router();
const {
  getAllEBikes,
  addEBike,
  deleteEBike,
} = require("../controllers/eBikeController");
const multer = require("multer");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Routes
router.post(
  "/",
  [authMiddleware, adminMiddleware, upload.single("image")],
  addEBike
);
//router.get("/", getAllEBikes, authMiddleware);
router.get("/", getAllEBikes);

router.delete("/:id", [authMiddleware, adminMiddleware], deleteEBike);

module.exports = router;
