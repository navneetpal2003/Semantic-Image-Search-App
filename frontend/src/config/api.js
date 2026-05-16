/**
 * Centralized API configuration.
 * Single source of truth for all backend communication.
 */
import axios from "axios";

export const API_BASE_URL =
  "https://semantic-image-search-app-2.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s for upload processing
});

/**
 * Search images using semantic query.
 * Empty query returns all images (latest first).
 */
export const searchImages = async (query = "") => {
  const res = await api.post(`/search?query=${encodeURIComponent(query)}`);
  return res.data.results;
};

/**
 * Upload an image file for AI processing & indexing.
 */
export const uploadImage = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: onProgress
      ? (e) => onProgress(Math.round((e.loaded * 100) / (e.total || 1)))
      : undefined,
  });
  return res.data;
};

export default api;
