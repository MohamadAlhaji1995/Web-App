const ReparaturAnfrage = require("../models/repairSchema");

exports.createReparaturAnfrage = async (req, res) => {
  try {
    const { bikeName, beschreibung, kontaktEmail } = req.body;

    // Validierung: Sicherstellen, dass alle Felder vorhanden sind
    if (!bikeName || !beschreibung || !kontaktEmail) {
      return res.status(400).json({ error: "Alle Felder sind erforderlich" });
    }

    // Erstellen eine neue Reparaturanfrage
    const neueAnfrage = new ReparaturAnfrage({
      bikeName,
      description: beschreibung,
      contactEmail: kontaktEmail,
    });

    await neueAnfrage.save();

    res
      .status(201)
      .json({ message: "Reparaturanfrage erfolgreich eingereicht" });
  } catch (error) {
    console.error(
      "Fehler bei der Einreichung der Reparaturanfrage:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Fehler bei der Verarbeitung Ihrer Anfrage" });
  }
};

exports.updateReparaturStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const updatedAnfrage = await ReparaturAnfrage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedAnfrage) {
      return res.status(404).json({ error: "Anfrage nicht gefunden" });
    }
    res.status(200).json(updatedAnfrage);
  } catch (error) {
    console.error("Fehler bei der Aktualisierung des Status:", error);
    res
      .status(500)
      .json({ error: "Fehler bei der Verarbeitung Ihrer Anfrage" });
  }
};

exports.getAllReparaturAnfragen = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 8;
    const skip = (page - 1) * pageSize;
    const total = await ReparaturAnfrage.countDocuments();
    const pages = Math.ceil(total / pageSize);
    const anfragen = await ReparaturAnfrage.find().skip(skip).limit(pageSize);

    res.status(200).json({
      pages,
      currentPage: page,
      anfragen,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Fehler beim Abrufen der Reparaturanfragen" });
  }
};

// Löschen einer Reparaturanfrage basierend auf der ID
exports.deleteReparaturAnfrage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAnfrage = await ReparaturAnfrage.findByIdAndDelete(id);

    if (!deletedAnfrage) {
      return res.status(404).json({ message: "Anfrage nicht gefunden" });
    }

    res.status(200).json({ message: "Reparaturanfrage erfolgreich gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen der Reparaturanfrage:", error.message);
    res.status(500).json({ error: "Fehler beim Löschen der Anfrage" });
  }
};
