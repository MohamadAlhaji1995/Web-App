//Registrierung, Anmeldung und das Abrufen aller Benutzer.

const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const register = async (req, res) => {
  //try {
  const { name, email, password } = req.body;

  // Überprüfung auf fehlende Felder
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Fehlende Felder" });
  }

  // Einfache E-Mail-Validierung
  if (!email.includes("@") || !email.includes(".")) {
    return res.status(400).json({ message: "Ungültige E-Mail-Adresse" });
  }

  // Passwortlänge überprüfen
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Das Passwort muss mindestens 6 Zeichen lang sein" });
  }

  // Benutzer existiert bereits?
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "Benutzer ist bereits vorhanden" });
  }

  // Passwort verschlüsseln und Benutzer speichern
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: "user",
  });
  await newUser.save();

  res.status(201).json({ message: "Benutzer erfolgreich registriert" });
  //} catch (error) {
  // res.status(500).json({ error: 'Fehler bei der Registrierung des Benutzers' });
  // }
};

const logIn = async (req, res) => {
  //try {
  const { email, password } = req.body;

  // Überprüfung auf fehlende Felder
  if (!email || !password) {
    return res.status(400).json({ message: "Fehlende Felder" });
  }

  // Benutzer mit der angegebenen E-Mail finden
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Benutzer nicht gefunden" });
  }

  // Passwort überprüfen
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    return res
      .status(401)
      .json({ message: "Username oder Password ist nicht korrekt" });
  }

  // JWT-Token erstellen
  const token = jwt.sign({ userId: user._id, role: user.role }, "secret_key", {
    expiresIn: "10h",
  });

  // Erfolgreiche Antwort zurückgeben
  res.status(200).json({
    message: "Sie haben sich eingeloggt",
    token,
    userID: user._id,
    role: user.role,
    name: user.name,
  });
  //} catch (error) {
  // res.status(500).json({ error: 'Fehler beim Benutzer-Login' });
  // }
};

async function createAdmin() {
  const adminEmail = "admin@test.com";
  const adminPassword = "123456";
  const adminRole = "admin";

  try {
    // Überprüfen, ob der Admin-Benutzer bereits existiert
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log("Admin nicht gefunden");

      // Passwort hashen
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      // Admin-Benutzer erstellen
      const admin = new User({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: adminRole,
      });

      // Benutzer in der Datenbank speichern
      await admin.save();
    }
  } catch (error) {
    console.error("Fehler beim Erstellen des Admin-Benutzers:", error);
  }
}

module.exports = { register, logIn, createAdmin };
