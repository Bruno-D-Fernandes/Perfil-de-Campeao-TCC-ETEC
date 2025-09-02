import api from '../api/axios';

const createUser = (data) => {
  return api.post('/cadastro', data);
};

const login = (token) => {
  return api.post('/perfil', { token });
};

const getUser = (id) => {
  return api.get(`/usuarios/${id}`); 
};

const updateUser = (id, data) => {
  return api.put(`/usuarios/${id}`, data);
};

const deleteUser = (id) => {
  return api.delete(`/usuarios/${id}`);
};

export default {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  login
};
