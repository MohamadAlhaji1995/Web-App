import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

// Stripe-Public-Key laden
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentMethod = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bike, type, rentalDays, totalPrice } = location.state || {};

  // Zahlungs- und Formularstatus speichern
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState({
    Vorname: "",
    Nachname: "",
    Straße: "",
    Stadt: "",
    Postleitzahl: "",
    Land: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paypalDetails, setPaypalDetails] = useState({
    email: "",
    password: "",
  });

  const stripe = useStripe();
  const elements = useElements();
  const finalPrice =
    totalPrice || (type === "rent" ? bike.rent * rentalDays : bike.price);

  // Adressänderung handhaben
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  // Formular für Adresse einreichen
  const submitAddressForm = (e) => {
    e.preventDefault();
    const { Vorname, Nachname, Straße, Stadt, Postleitzahl, Land } = address;
  
    // Validierung für Vorname: nur Buchstaben erlaubt
    if (!Vorname || !/^[A-Za-zäöüÄÖÜß\s]+$/.test(Vorname)) {
      alert("Vorname darf nur Buchstaben enthalten.");
      return;
    }
  
    // Validierung für Nachname: nur Buchstaben erlaubt
    if (!Nachname || !/^[A-Za-zäöüÄÖÜß\s]+$/.test(Nachname)) {
      alert("Nachname darf nur Buchstaben enthalten.");
      return;
    }
  
    // Validierung für Straße: Kombination aus Buchstaben und Zahlen erlaubt
    if (!Straße || !/^[A-Za-z0-9äöüÄÖÜß\s]+$/.test(Straße)) {
      alert("Straße darf nur Buchstaben und Zahlen enthalten.");
      return;
    }
  
    // Validierung für Stadt: nur Buchstaben erlaubt
    if (!Stadt || !/^[A-Za-zäöüÄÖÜß\s]+$/.test(Stadt)) {
      alert("Stadt darf nur Buchstaben enthalten.");
      return;
    }
  
    // Validierung für Postleitzahl: nur Zahlen erlaubt
    if (!Postleitzahl || !/^\d+$/.test(Postleitzahl)) {
      alert("Postleitzahl darf nur Zahlen enthalten.");
      return;
    }
  
    // Validierung für Land: nur Buchstaben erlaubt
    if (!Land || !/^[A-Za-zäöüÄÖÜß\s]+$/.test(Land)) {
      alert("Land darf nur Buchstaben enthalten.");
      return;
    }
  
    // Falls alle Validierungen erfolgreich sind
    setCurrentStep(2);
  };
  
  // Zahlungsmethode auswählen
  const selectPaymentMethod = (e) => setPaymentMethod(e.target.value);

  // Stripe-Zahlung abwickeln
  const processStripePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setErrorMessage("Stripe ist nicht verfügbar.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
      if (error) throw error;

      setPaymentSuccess(true);
      clearCart();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // PayPal-Zahlung abwickeln
  const processPayPalPayment = (e) => {
    e.preventDefault();
    if (!paypalDetails.email || !paypalDetails.password) {
      setErrorMessage("Bitte PayPal-Daten eingeben.");
      return;
    }

    setPaymentSuccess(true);
    clearCart();
  };

  // Warenkorb leeren
  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.delete("http://localhost:3001/api/cart/clear", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Warenkorb geleert.");
      }
    } catch (error) {
      console.error("Fehler beim Leeren des Warenkorbs:", error);
    }
  };

  if (!bike && totalPrice === undefined) {
    return (
      <div className="max-w-[600px] mx-auto p-6 bg-white/20 rounded-2xl backdrop-blur-md shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Fehler: Keine Daten gefunden!
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="w-full p-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600"
        >
          Zurück
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto p-6 bg-white/20 rounded-2xl backdrop-blur-md shadow-lg">
      {currentStep === 1 ? (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Lieferadresse eingeben
          </h2>
          <form onSubmit={submitAddressForm} className="space-y-4">
            {[
              "Vorname",
              "Nachname",
              "Straße",
              "Stadt",
              "Postleitzahl",
              "Land",
            ].map((field) => (
              <div key={field}>
                <label className="block font-semibold text-blue-800">
                  {field}:
                </label>
                <input
                  type="text"
                  name={field}
                  value={address[field]}
                  onChange={handleAddressChange}
                  className="w-full p-3 rounded-2xl bg-gray-100"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition duration-300"
            >
              Weiter
            </button>
          </form>
        </div>
      ) : (
        !paymentSuccess && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              Zahlungsmethode auswählen
            </h2>
            <p className="text-lg mb-4">Gesamtpreis: {finalPrice}€</p>
            <div className="space-y-4">
              <label className="block font-semibold text-blue-800">
                <input
                  type="radio"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={selectPaymentMethod}
                />{" "}
                PayPal
              </label>
              <label className="block font-semibold text-blue-800">
                <input
                  type="radio"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={selectPaymentMethod}
                />{" "}
                Kreditkarte
              </label>
            </div>

            {paymentMethod === "paypal" && (
              <form onSubmit={processPayPalPayment} className="mt-4">
                <div>
                  <label className="block font-semibold text-blue-800">
                    PayPal E-Mail:
                  </label>
                  <input
                    type="email"
                    value={paypalDetails.email}
                    onChange={(e) =>
                      setPaypalDetails({
                        ...paypalDetails,
                        email: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-2xl bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-blue-800">
                    PayPal Passwort:
                  </label>
                  <input
                    type="password"
                    value={paypalDetails.password}
                    onChange={(e) =>
                      setPaypalDetails({
                        ...paypalDetails,
                        password: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-2xl bg-gray-100"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600"
                >
                  Bestätigen
                </button>
              </form>
            )}

            {paymentMethod === "stripe" && (
              <form onSubmit={processStripePayment} className="mt-4">
                <CardElement
                  className="p-3 border border-gray-300 rounded-2xl"
                  options={{ hidePostalCode: true }}
                />
                <button
                  type="submit"
                  className="w-full p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600"
                >
                  Bezahlen
                </button>
              </form>
            )}
          </>
        )
      )}

      {paymentSuccess && (
        <div className="bg-green-100 p-4 rounded-lg mt-4 text-green-800">
          <h3 className="text-xl font-bold">Zahlung erfolgreich!</h3>
          <p>Vielen Dank für Ihre Zahlung.</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 p-4 rounded-lg mt-4 text-red-800">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;

