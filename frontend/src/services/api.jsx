import axios from "axios";

const API_URL = "http://localhost:4000/api";


// User APIs
export const registerUser = async (data) => {
  return axios.post(`${API_URL}/users/register`, data);
};

export const loginUser = async (data) => {
  return axios.post(`${API_URL}/users/login`, data);
};


// SparePart APIs
export const getSpareParts = async (token) => {
  return axios.get(`${API_URL}/spareparts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createSparePart = async (data, token) => {
  return axios.post(`${API_URL}/spareparts`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateSparePart = async (id, data, token) => {
  return axios.put(`${API_URL}/spareparts/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteSparePart = async (id, token) => {
  return axios.delete(`${API_URL}/spareparts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// StockIn APIs
export const getStockIns = async (token) => {
  return axios.get(`${API_URL}/stockin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createStockIn = async (data, token) => {
  return axios.post(`${API_URL}/stockin`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateStockIn = async (id, data, token) => {
  return axios.put(`${API_URL}/stockin/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteStockIn = async (id, token) => {
  return axios.delete(`${API_URL}/stockin/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// StockOut APIs
export const getStockOuts = async (token) => {
  return axios.get(`${API_URL}/stockout`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createStockOut = async (data, token) => {
  return axios.post(`${API_URL}/stockout`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateStockOut = async (id, data, token) => {
  return axios.put(`${API_URL}/stockout/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteStockOut = async (id, token) => {
  return axios.delete(`${API_URL}/stockout/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
