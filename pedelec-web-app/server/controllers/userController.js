const User = require("../models/userSchema");

// Benutzer aktualisieren
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Aktualisieren des Benutzers" });
  }
};

// Benutzer löschen
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    res.status(200).json({ message: "Benutzer erfolgreich gelöscht" });
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen des Benutzers" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    //console.error('Fehler beim Abrufen der Benutzer:', error);
    res.status(500).json({ error: "Fehler beim Abrufen der Benutzer" });
  }
};

module.exports = { getUsers, updateUser, deleteUser };
