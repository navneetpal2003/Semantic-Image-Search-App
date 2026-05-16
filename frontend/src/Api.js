import axios from "axios";

const BASE_URL = "https://semantic-image-search-app-2.onrender.com";


export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${BASE_URL}/upload`, formData);
};

export const searchImages = async (query) => {
  return axios.post(`${BASE_URL}/search?query=${query}`);
};