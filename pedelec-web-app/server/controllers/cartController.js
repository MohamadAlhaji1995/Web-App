const Cart = require('../models/cartSchema');

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.eBike');
    if (!cart) {
      return res.status(404).json({ message: 'Warenkorb nicht gefunden' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Abrufen des Warenkorbs' });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    if (!productId || typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ error: 'Ungültige Produkt-ID oder Menge.' });
    }

    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.eBike.toString() === productId.toString());

    console.log('Versuch, Produkt hinzuzufügen:', productId);
    console.log('Überprüfen, ob das Produkt bereits im Warenkorb ist ...');

    if (itemIndex > -1) {
      console.log('Produkt bereits im Warenkorb');
      return res.status(200).json({ message: 'Dieses Produkt befindet sich bereits im Warenkorb.' });
    } else {
      cart.items.push({ eBike: productId, quantity });
      await cart.save();
      console.log(`Artikel ${productId} zum Warenkorb hinzugefügt`);
      return res.status(200).json({ message: 'Produkt erfolgreich zum Warenkorb hinzugefügt' });
    }
  } catch (error) {
    console.error('Fehler beim Hinzufügen zum Warenkorb:', error);
    res.status(500).json({ error: 'Fehler beim Hinzufügen zum Warenkorb' });
  }
};
const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Warenkorb nicht gefunden' });
    }

    cart.items = cart.items.filter(item => item.eBike.toString() !== productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Entfernen aus dem Warenkorb' });
  }
};

const updateCartItemQuantity = async (req, res) => {
    const { productId, action } = req.body;
    try {
      const cart = await Cart.findOne({ user: req.user.userId });
      if (!cart) {
        return res.status(404).json({ message: 'Warenkorb nicht gefunden' });
      }
  
      const itemIndex = cart.items.findIndex(item => item.eBike.toString() === productId);
      if (itemIndex > -1) {
        if (action === 'increase') {
          cart.items[itemIndex].quantity += 1;
        } else if (action === 'decrease') {
          cart.items[itemIndex].quantity -= 1;
          if (cart.items[itemIndex].quantity <= 0) {
            cart.items.splice(itemIndex, 1); 
          }
        }
        await cart.save();
        res.status(200).json(cart);
      } else {
        return res.status(404).json({ message: 'Artikel nicht im Warenkorb gefunden' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Aktualisieren des Warenkorbs' });
    }
  };

  const clearCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.userId });
      if (!cart) {
        return res.status(404).json({ message: 'Warenkorb nicht gefunden' });
      }
  
      cart.items = []; // Alle Artikel aus dem Warenkorb entfernen
      await cart.save();
      res.status(200).json({ message: 'Warenkorb geleert.' });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Leeren des Warenkorbs' });
    }
  };
  
  module.exports = { getCart, addToCart, removeFromCart, updateCartItemQuantity,clearCart };
