import api from './axios';

const createUser = (data) => {
  return api.post('/register', data);
};

const loginUser = (data) => {
    const response = api.post('/login', data); // Sapoha não precisa passar o token no payload chapei, arruma ai Bruno do futuro

    return response;
};

const splashUser = (data) => {
    const response = api.get('/perfil', data); // Sapoha não precisa passar o token no payload chapei, arruma ai Bruno do futuro
    return response;
}; // manter esse metodo spash user para essa primeira entrega | tirar depois

const perfilUser = async (data) => {
    try {
        const response = await api.get('/perfil', data); // Sapoha não precisa passar o token no payload chapei, arruma ai Bruno do futuro
        console.log('Perfil user usado');
        return response;
    } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        throw error;
    }
};

const oportunidadeData = (page = 1, perPage = 15) => {
    return api.get(`/oportunidades?page=${page}&per_page=${perPage}`);
};


const deleteUser = (id) => {
     return api.delete(`/destroy/${id}`);  // seria interessante colocar um tratamento de erro aqui | depois por
}; // arrumar isso

const logoutUser = () => {
    return api.post('/logout');
};

// Arrumar a parte de baixo 

const editUser = (data, id) => {
    return api.put(`/update/${id}`, data);
};

export const inscreverOportunidade = async (idOportunidade) => {
  try {
    const response = await api.post(`/oportunidades/${idOportunidade}/inscrever`);
    return response.data;
  } catch (error) {
    console.error('Erro ao se inscrever na oportunidade:', error);
    throw error;
  }
};

export default { createUser, loginUser, splashUser, deleteUser, editUser, logoutUser, perfilUser, oportunidadeData, inscreverOportunidade };
