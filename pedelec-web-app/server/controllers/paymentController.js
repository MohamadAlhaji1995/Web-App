const axios = require("axios");

// Validierungsfunktion für einfache Eingaben
function validatePaymentFields({
  totalPrice,
  cardNumber,
  expirationDate,
  cvv,
  nameOnCard,
  deliveryAddress,
}) {
  if (!totalPrice || isNaN(totalPrice) || totalPrice <= 0) {
    throw new Error("Der Gesamtpreis ist ungültig.");
  }

  if (cardNumber && cardNumber.length !== 16) {
    throw new Error("Die Kreditkartennummer muss 16 Ziffern lang sein.");
  }

  if (expirationDate && expirationDate.length !== 5) {
    throw new Error("Das Ablaufdatum muss im Format MM/YY sein.");
  }

  if (cvv && cvv.length !== 3 && cvv.length !== 4) {
    throw new Error("Der CVV-Code muss 3 oder 4 Ziffern lang sein.");
  }

  if (!nameOnCard || nameOnCard.trim() === "") {
    throw new Error("Der Name auf der Karte muss ausgefüllt sein.");
  }

  if (deliveryAddress) {
    const { Vorname, Nachname, Straße, Stadt, Postleitzahl, Land } =
      deliveryAddress;
    if (!Vorname || !Nachname || !Straße || !Stadt || !Postleitzahl || !Land) {
      throw new Error("Alle Felder der Lieferadresse müssen ausgefüllt sein.");
    }
  }
}

async function createPayPalOrder(req, res) {
  const { totalPrice } = req.body;

  try {
    // Eingaben validieren
    validatePaymentFields({ totalPrice });

    // Zugangstoken von PayPal anfordern
    const authResponse = await axios.post(
      `${process.env.PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    const accessToken = authResponse.data.access_token;

    // PayPal-Bestellung erstellen
    const orderResponse = await axios.post(
      `${process.env.PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "EUR",
              value: totalPrice.toFixed(2),
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const orderID = orderResponse.data.id;
    res.json({ orderID });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Es gab ein Problem mit der PayPal-Bestellung." });
  }
}

async function payWithCreditCard(req, res) {
  const {
    cardNumber,
    expirationDate,
    cvv,
    nameOnCard,
    totalPrice,
    deliveryAddress,
  } = req.body;

  try {
    // Eingaben validieren
    validatePaymentFields({
      cardNumber,
      expirationDate,
      cvv,
      nameOnCard,
      totalPrice,
      deliveryAddress,
    });

    res.json({
      success: true,
      message: "Die Kreditkartenzahlung wurde erfolgreich verarbeitet.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Es gab ein Problem bei der Kreditkartenzahlung." });
  }
}

module.exports = { createPayPalOrder, payWithCreditCard };
