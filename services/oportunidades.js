import api from "./axios";

export const oportunidadeData = (page = 1, perPage = 15) => {
  return api.get(`/oportunidades?page=${page}&per_page=${perPage}`);
};

export const inscreverOportunidade = async (idOportunidade) => {
  try {
    const response = await api.post(
      `/oportunidades/${idOportunidade}/inscrever`
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao se inscrever na oportunidade:", error);
    throw error;
  }
};

export default {
  oportunidadeData,
  inscreverOportunidade,
};
