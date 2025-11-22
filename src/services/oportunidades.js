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

export const inscricoesOportunidades = async () => {
  try {
    const response = await api.get(`/inscricoes`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar inscrições:", error);
    throw error;
  }
};

export const oportunidadeFiltrar = async (filtros) => {
  try {
    const config = { params: filtros };
    const response = await api.get(`/oportunidades/filtrar`, config);
    return response.data;
  } catch (error) {
    console.error("Erro ao filtrar oportunidades:", error);
    throw error;
  }
};

export default {
  oportunidadeData,
  inscreverOportunidade,
  inscricoesOportunidades,
  oportunidadeFiltrar,
};
