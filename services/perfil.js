import api from './axios';

 export const handleForm = async (id) => {
  try {
    const response = await api.get(`perfilForm/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar formulário:', error);
    throw error;
  }


};

 export const createPerfil = async (data) => {
  try {
    const response = await api.post(`perfilStore`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    throw error;
  }
}

export const loadPerfilAll = async () => {
    try {
    const response = await api.get(`loadPerfilAll`);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    throw error;
  }
}

