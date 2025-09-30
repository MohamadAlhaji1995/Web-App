/*
import axios from "axios";

const API_URL = "http://localhost:3001/api";

// Hilfsfunktion zum Abrufen des Tokens
const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Kein Token im LocalStorage gefunden");
  }
  return token;
};

// Globale Axios-Instanz mit Standardwerten
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
*/