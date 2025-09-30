import React from "react";

const CartItem = ({ item, handleQuantityChange, handleRemoveFromCart }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white/30 rounded-lg shadow-md">
      <img
        src={`http://localhost:3001${item.eBike.imageUrl}`}
        alt={item.eBike.name}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-semibold">{item.eBike.name}</h3>
        <p>Farbe: {item.eBike.color}</p>
        <p>Marke: {item.eBike.brand}</p>
        <p>Preis: {item.eBike.price}€</p>
        <div className="flex items-center space-x-4 mt-2">
          <button
            onClick={() => handleQuantityChange(item.eBike._id, "decrease")}
            disabled={item.quantity === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
          >
            -
          </button>
          <span className="text-lg">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.eBike._id, "increase")}
            className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() => handleRemoveFromCart(item.eBike._id)}
        className="p-2 m-3 ml-6 rounded-2xl text-red-600 border-red-600 hover:bg-red-100 border-2 font-bold text-lg"
      >
        Entfernen
      </button>
    </div>
  );
};

export default CartItem;
