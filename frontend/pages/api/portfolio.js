
import axios from "axios";

const API_URL = "https://alson-portfolio-2026.onrender.com";

export const getPortfolioContent = async () => {
  const response = await axios.get(`${API_URL}/portfolio`);
  return response.data.content;
};

export const savePortfolioContent = async (content) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Please log in as admin before saving changes.");
  }

  const response = await axios.put(
    `${API_URL}/portfolio`,
    content,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.content;
};
