// für das Hinzufügen, Abrufen und Löschen von E-Bikes.
const EBike = require("../models/eBikeSchema");

// Funktion zur Validierung der E-Bike-Daten
const validateEBikeData = (name, color, brand, price, rent) => {
  if (!name) return "Name fehlt";
  if (!color) return "Farbe fehlt";
  if (!brand) return "Marke fehlt";
  if (!price || isNaN(price) || price <= 0) return "Ungültiger Preis";
  if (!rent || isNaN(rent) || rent <= 0) return "Ungültiger Mietpreis";

  return true;
};

// Alle E-Bikes abrufen
const getAllEBikes = async (req, res) => {
  //try {
  // E-Bikes aus der Datenbank holen
  const eBikes = await EBike.find();
  res.status(200).json(eBikes); // Erfolgreiche Antwort
  //} catch (error) {
  // Fehler beim Abrufen der Daten
  // res.status(500).json({ error: 'Fehler beim Abrufen der E-Bikes' });
  //}
};

// E-Bike hinzufügen
const addEBike = async (req, res) => {
  try {
    const { name, color, brand, price, rent } = req.body;

    // Validierung der Eingabedaten
    //const validationError = validateEBikeData(name, color, brand, price, rent);
    //if (validationError) {
    //return res.status(400).json({ message: validationError });
    //}

    // Daten des E-Bikes vorbereiten
    const eBikeData = { name, color, brand, price, rent };
    if (req.file) {
      eBikeData.imageUrl = `/uploads/${req.file.filename}`; // Bild-Upload hinzufügen
    }

    // Neues E-Bike speichern
    const newEBike = new EBike(eBikeData);
    await newEBike.save();

    // Erfolgreiche Antwort
    //res.status(201).json(newEBike);
    res.status(200).json({ message: "E-Bike erfolgreich hinzugefügt" });
  } catch (error) {
    //Fehler beim Speichern des E-Bikes
    res.status(500).json({ error: "Fehler beim Hinzufügen des E-Bikes" });
  }
};

// E-Bike löschen
const deleteEBike = async (req, res) => {
  try {
    // E-Bike anhand der ID löschen
    const eBike = await EBike.findByIdAndDelete(req.params.id);

    if (!eBike) {
      return res.status(404).json({ message: "E-Bike nicht gefunden" });
    }

    res.status(200).json({ message: "E-Bike erfolgreich gelöscht" });
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Löschen des E-Bikes" });
  }
};

module.exports = { getAllEBikes, addEBike, deleteEBike, validateEBikeData };
