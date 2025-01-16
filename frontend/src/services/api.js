import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post("/token/", { username, password });
  return response.data;
};

export const getAdminTickets = async (filters = {}) => {
  const response = await api.get("/tickets/", { params: filters });
  return response.data;
};

export const getTickets = async (filters = {}, user_id) => {

  const params = { ...filters, user_id: user_id };

  const response = await api.get("/tickets/", { params });
  return response.data;
};

export const getTicket = async (id) => {
  const response = await api.get(`/tickets/${id}/`);
  return response.data;
};

export const createTicket = async (ticketData) => {
  const response = await api.post("/tickets/", ticketData);
  return response.data;
};

export const updateTicket = async (id, ticketData) => {
  const response = await api.put(`/tickets/${id}/`, ticketData);
  return response.data;
};

export const deleteTicket = async (id) => {
  await api.delete(`/tickets/${id}/`);
};
