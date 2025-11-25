import { API_URL } from "@env";
import api from "./axios";

export const fetchContacts = async () => {
  try {
    const response = await api.get("/conversations", {
      baseURL: `${API_URL}/api`,
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    throw error;
  }
};
