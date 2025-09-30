import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

export const loginApi = async (email, password) => {
  return await axios.post(`${API_URL}/logIn`, { email, password });
};

export const register = async (name, email, password) => {
  return await axios.post(`${API_URL}/register`, { name, email, password });
};
