import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import Pagination from "../components/Pagination";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const navigate = useNavigate();

  const fetchCartItems = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Kein Token im LocalStorage gefunden");
        return;
      }

      const response = await axios.get("http://localhost:3001/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const validItems = response.data.items.filter(
        (item) => item?.eBike?.price && item?.quantity
      );
      setCartItems(validItems);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error(
          "Token ungültig oder abgelaufen. Bitte loggen Sie sich erneut ein."
        );
        localStorage.removeItem("token");
        alert("Ihre Sitzung ist abgelaufen. Bitte loggen Sie sich erneut ein.");
        navigate("/LogIn");
      } else {
        console.error("Fehler beim Abrufen des Warenkorbs:", error);
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleRemoveFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Kein Token im LocalStorage gefunden");
        return;
      }

      await axios.delete(`http://localhost:3001/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Korrektur
      });
      setCartItems(cartItems.filter((item) => item.eBike._id !== productId));
    } catch (error) {
      console.error(
        "Fehler beim Entfernen des Artikels aus dem Warenkorb:",
        error
      );
    }
  };

  const handleQuantityChange = async (productId, action) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Kein Token im LocalStorage gefunden");
        return;
      }

      await axios.post(
        "http://localhost:3001/api/cart/update-quantity",
        {
          productId,
          action,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, 
        }
      );

      setCartItems((prevItems) =>
        prevItems
          .map((item) =>
            item.eBike._id === productId
              ? {
                  ...item,
                  quantity:
                    action === "increase"
                      ? item.quantity + 1
                      : item.quantity - 1,
                }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Artikelmenge:", error);
    }
  };

  // Berechnung der Artikel für die aktuelle Seite
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

  // Gesamtpreis berechnen
  const totalPrice = cartItems
    .filter((item) => item?.eBike?.price && item?.quantity)
    .reduce((total, item) => total + item.eBike.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return <p className="text-center text-xl mt-10">Ihr Warenkorb ist leer.</p>;
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6 bg-white/20 rounded-2xl backdrop-blur-md shadow-lg">
      <h1 className="text-3xl font-bold text-blue-900 text-center mb-6">
        Ihr Warenkorb
      </h1>

      <div className="space-y-3">
        {currentItems.map((item, index) => (
          <CartItem
            key={index}
            item={item}
            handleQuantityChange={handleQuantityChange}
            handleRemoveFromCart={handleRemoveFromCart}
          />
        ))}
      </div>

      <CartSummary
        totalPrice={totalPrice}
        handlePayNow={() => navigate("/Payment", { state: { totalPrice } })}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(cartItems.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Cart;
