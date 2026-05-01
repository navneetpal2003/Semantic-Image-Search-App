import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${BASE_URL}/upload`, formData);
};

export const searchImages = async (query) => {
  return axios.post(`${BASE_URL}/search?query=${query}`);
};