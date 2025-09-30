import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const fetchEBikes = async () => {
  try {
    const response = await axios.get(`${API_URL}/eBikes`);
    return response.data;
  } catch (error) {
    console.error("Fehler beim Abrufen der E-Bikes:", error);
    throw error;
  }
};

export const addToCart = async (bikeId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/cart/add`,
      { productId: bikeId, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.message;
  } catch (error) {
    console.error("Fehler beim Hinzufügen zum Warenkorb:", error);
    throw error;
  }
};

export const deleteBike = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/eBikes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Fehler beim Löschen des E-Bikes:", error);
    throw error;
  }
};
