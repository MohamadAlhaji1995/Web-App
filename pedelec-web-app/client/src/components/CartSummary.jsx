import React from "react";

const CartSummary = ({ totalPrice, handlePayNow }) => {
  return (
    <div className="text-right text-xl font-bold text-blue-900 mt-4">
      <p>Gesamtpreis: {totalPrice}€</p>
      <button
        onClick={handlePayNow}
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Jetzt bezahlen
      </button>
    </div>
  );
};

export default CartSummary;