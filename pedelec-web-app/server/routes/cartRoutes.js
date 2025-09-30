const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} = require("../controllers/cartController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/cart", authMiddleware, getCart);
router.post("/cart/add", authMiddleware, addToCart);
router.delete("/cart/remove/:productId", authMiddleware, removeFromCart);
router.post("/cart/update-quantity", authMiddleware, updateCartItemQuantity);
router.delete("/cart/clear", authMiddleware, clearCart);

module.exports = router;
