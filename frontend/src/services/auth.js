import axios from "axios";

const API_URL = "http://localhost:8000/api/";

export const register = async (userData) => {
  const response = await axios.post(API_URL + "register/", userData);
  return response.data;
};

export const login = async (username, password) => {
  const response = await axios.post(API_URL + "token/", {
    username,
    password,
  });
  if (response.data.access) {
    localStorage.setItem("token", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
};
