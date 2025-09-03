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
};

const deleteUser = (id) => {
     return api.delete(`/destroy/${id}`);  // seria interessante colocar um tratamento de erro aqui | depois por
}; // arrumar isso

const logoutUser = () => {
    return api.post('/logout');
};

// Arrumar a parte de baixo 

const editUser = (data, id) => {
    return api.put(`/users/${id}`, data);
};

export default { createUser, loginUser, splashUser, deleteUser, editUser, logoutUser };
