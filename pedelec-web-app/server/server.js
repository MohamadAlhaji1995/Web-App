//server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const {
  authMiddleware,
  adminMiddleware,
} = require("./middleware/authMiddleware");
const createAdmin = require("./controllers/authController").createAdmin;

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eBikeRoutes = require("./routes/eBikeRoutes");
const userRoutes = require("./routes/userRoutes");
const searchRoutes = require("./routes/searchRoutes");
const repairRoutes = require("./routes/repairRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRouter = require("./routes/paymentRoutes");

dotenv.config(); // .env-Datei

const server = express();
const port = process.env.PORT || 3001;

// Middleware
server.use(cors()); // um Anfragen von verschiedenen Domains zu ermöglichen.
server.use(bodyParser.json()); // Verarbeitet eingehende JSON-Daten in den Anfragen.
server.use(bodyParser.urlencoded({ extended: true })); // Verarbeitet URL-kodierte Daten in den Anfragen, z.B. Formulardaten.
server.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Stellt statische Dateien im 'uploads'-Ordner über den Pfad '/uploads' bereit.

// Routes
server.use("/api/auth", authRoutes);
server.use("/api/eBikes", eBikeRoutes);
server.use("/api/users", userRoutes);
server.use("/api/search", searchRoutes);
server.use("/api", repairRoutes);
server.use("/api", cartRoutes);
server.use("/api", paymentRouter);

// MongoDB-Verbindung, falls nicht im Testmodus
if (process.env.NODE_ENV !== "test") {
  connectDB();
  createAdmin();

  server.listen(port, () => {
    console.log("Server launcht auf den Port: " + port);
  });
}

module.exports = server;
