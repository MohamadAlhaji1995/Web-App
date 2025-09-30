
const EBike = require('../models/eBikeSchema');

const validateSearchParams = ({ term, brand, color, minPrice, maxPrice }) => {
  if (minPrice && isNaN(minPrice))
    return 'Ungültiger Mindestpreis';
  if (maxPrice && isNaN(maxPrice))
    return 'Ungültiger Höchstpreis';
  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice))
    return 'Mindestpreis darf nicht größer als Höchstpreis sein';
  return null;
};

const searchEBikes = async (req, res) => {
  try {
    const { term, brand, color, minPrice, maxPrice } = req.body;

    const validationError = validateSearchParams({ term, brand, color, minPrice, maxPrice });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    let filters = {};

    if (term) {
      filters.name = new RegExp(term, 'i');
    }
    if (brand) {
      filters.brand = new RegExp(brand, 'i');
    }
    if (color) {
      filters.color = new RegExp(color, 'i');
    }
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) {
        filters.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filters.price.$lte = Number(maxPrice);
      }
    }

    const results = await EBike.find({
      ...(term && { name: filters.name }),
      ...(brand && { brand: filters.brand }),
      ...(color && { color: filters.color }),
      ...(minPrice || maxPrice) && { price: filters.price }
    }).sort({ name: 1 });

    res.json(results);
  } catch (error) {
    console.error('Fehler bei der Suche:', error);
    res.status(500).json({ message: "Ein Fehler ist aufgetreten", error });
  }
};

const getAllEBikes = async (req, res) => {
  try {
    const eBikes = await EBike.find();
    res.status(200).json(eBikes);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Abrufen der E-Bikes' });
  }
};

const getAvailableBrands = async (req, res) => {
  try {
    const brands = await EBike.distinct('brand'); 
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Marken' });
  }
};
module.exports = { searchEBikes, getAllEBikes,getAvailableBrands};
