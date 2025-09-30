const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// Authentifizierungsmiddleware (Prüft, ob der Benutzer authentifiziert ist)
const authMiddleware = (req, res, next) => {
  // Token aus dem Authorization-Header extrahieren
  const authHeader = req.headers["authorization"];

  // Prüfen, ob der Header existiert und ob er mit "Bearer " beginnt
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Zugriff verweigert, kein Authorization-Header vorhanden",
    });
  }

  // Token aus dem Header extrahieren (nach dem "Bearer ")
  const token = authHeader.split(" ")[1];

  // Token prüfen (verifizieren) mit jwt.verify()
  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Ungueltiges Token" });
    }

    // Benutzerinformationen aus dem Token im req.user speichern
    req.user = decoded;
    next();
  });
};

// Adminrechte-Middleware (Prüft, ob der Benutzer ein Admin ist)
const adminMiddleware = (req, res, next) => {
  // Sicherstellen, dass der Benutzer eingeloggt ist und die Rolle 'admin' hat
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Zugriff verweigert, nur Admins erlaubt" });
  }

  next();
};

module.exports = { authMiddleware, adminMiddleware };
