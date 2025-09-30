import React from 'react';

const PaymentOptions = ({ paymentMethod, setPaymentMethod, handlePayment }) => {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-800">
          Zahlungsmethode auswählen
        </h2>
        <div className="space-y-4">
          <label className="block font-semibold text-blue-800">
            <input
              type="radio"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{" "}
            PayPal
          </label>
          <label className="block font-semibold text-blue-800">
            <input
              type="radio"
              value="credit"
              checked={paymentMethod === "credit"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />{" "}
            Kreditkarte
          </label>
        </div>
        <button
          onClick={handlePayment}
          className="w-full mt-4 p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600"
        >
          Zahlung bestätigen
        </button>
      </div>
    );
  };


  export default PaymentOptions;