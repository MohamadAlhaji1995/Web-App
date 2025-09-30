import axios from "axios";

const BASE_URL = "http://localhost:3001/api/cart";

// Hilfsfunktion zum Abrufen des Tokens
const getToken = () => localStorage.getItem("token");

export const fetchCartItems = async () => {
  const token = getToken();
  if (!token) {
    throw new Error("Kein Token im LocalStorage gefunden");
  }

  const response = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.items;
};

export const removeCartItem = async (productId) => {
  const token = getToken();
  if (!token) {
    throw new Error("Kein Token im LocalStorage gefunden");
  }

  await axios.delete(`${BASE_URL}/remove/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateCartItemQuantity = async (productId, action) => {
  const token = getToken();
  if (!token) {
    throw new Error("Kein Token im LocalStorage gefunden");
  }

  await axios.post(
    `${BASE_URL}/update-quantity`,
    { productId, action },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
