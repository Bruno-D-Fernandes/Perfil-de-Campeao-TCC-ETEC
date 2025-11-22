import api from "./axios";

export const postagemData = async (formData) => {
  try {
    const response = await api.post("/postagem", formData, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao enviar postagem:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getPostagensAll = async () => {
  try {
    const response = await api.get("/postagem");
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar postagens:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getPostagensPorUsuario = async (userId, esporteId) => {
  try {
    const response = await api.get(`/postagem/user/${userId}/${esporteId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar postagens do usuário:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updatePostagemUser = async (postagemId, data) => {
  try {
    const response = await api.post(`/postagem/${postagemId}`, data);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao atualizar postagem do usuário:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deletePostagemUser = async (postagemId) => {
  try {
    const response = await api.delete(`/postagem/${postagemId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao deletar postagem do usuário:",
      error.response?.data || error.message
    );
    throw error;
  }
};
