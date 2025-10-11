import api from './axios';

const createUser = (data) => {
  return api.post('/register', data);
};

const loginUser = (data) => {
  return api.post('/login', data);
};

const splashUser = () => {
  return api.get('/perfil');
}; // manter esse método temporariamente

const perfilUser = async () => {
  try {
    const response = await api.get('/perfil');
    console.log('Perfil user usado');
    return response;
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    throw error;
  }
};

const editUser = (data, id) => {
  return api.put(`/update/${id}`, data);
};

const deleteUser = (id) => {
  return api.delete(`/destroy/${id}`);
};

const logoutUser = () => {
  return api.post('/logout');
};

export default {
  createUser,
  loginUser,
  splashUser,
  perfilUser,
  editUser,
  deleteUser,
  logoutUser,
};
