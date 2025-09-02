import api from './axios';

const createUser = (data) => {
  return api.post('/register', data);
};

const loginUser = (data) => {
    const response = api.post('/login', data);

    return response;
};

const splashUser = (data) => {
    const response = api.get('/perfil', data);
    return response;
};

const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
}; // arrumar isso

const editUser = (data, id) => {
    return api.put(`/users/${id}`, data);
};

export default { createUser, loginUser, splashUser, deleteUser, editUser };
