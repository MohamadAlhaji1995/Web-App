const express = require("express");
const router = express.Router();
const {
  createPayPalOrder,
  payWithCreditCard,
} = require("../controllers/paymentController");

router.post("/paypal/create-order", createPayPalOrder);
//router.post('/stripe/create-payment-intent', createStripePaymentIntent);
router.post("/pay-with-credit-card", payWithCreditCard);
module.exports = router;
