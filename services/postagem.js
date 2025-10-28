import api from './axios';

const postagemData = async (formData) => {
  try {
    const response = await api.post('/postagem', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar postagem:', error.response?.data || error.message);
    throw error;
  }
};

const getPostagens = async () => {
  try {
    const response = await api.get('/postagem');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar postagens:', error.response?.data || error.message);
    throw error;
  }
};

const getPostagensPorUsuario = async (userId) => {
  try {
    const response = await api.get(`/postagem/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar postagens do usuário:', error.response?.data || error.message);
    throw error;
  }
};

export default { postagemData, getPostagens, getPostagensPorUsuario };
