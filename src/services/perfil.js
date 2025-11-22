import api from "./axios";

export const handleForm = async (id) => {
  try {
    const response = await api.get(`perfilForm/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar formulário:", error);
    throw error;
  }
};

export const updatePerfil = async (id, data) => {
  try {
    const response = await api.put(`/perfil/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};

export const excluirPerfil = async (id) => {
  try {
    const response = await api.delete(`/perfil/excluir/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar perfil:", error);
    throw error;
  }
};

export const createPerfil = async (data) => {
  try {
    const response = await api.post(`perfilStore`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    throw error;
  }
};

export const loadPerfilAll = async () => {
  try {
    const response = await api.get(`loadPerfilAll`);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    throw error;
  }
};
