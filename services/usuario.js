import api from "./axios";

const createUser = (data) => {
  return api.post("/register", data);
};

const loginUser = (data) => {
  return api.post("/login", data);
};

const splashUser = () => {
  const response = api.get("/perfil"); // Sapoha não precisa passar o token no payload chapei, arruma ai Bruno do futuro
  return response;
}; // manter esse metodo spash user para essa primeira entrega | tirar depois

const perfilUser = async (data) => {
  try {
    const response = await api.get("/perfil", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }); // Sapoha não precisa passar o token no payload chapei, arruma ai Bruno do futuro
    console.log("Perfil user usado");
    return response;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    throw error;
  }
};

const oportunidadeData = (page = 1, perPage = 15) => {
  return api.get(`/oportunidades?page=${page}&per_page=${perPage}`);
};

export const inscreverOportunidade = async (idOportunidade) => {
  try {
    const response = await api.get("/perfil");
    console.log("Perfil user usado");
    return response;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    throw error;
  }
};

const editUser = async (formData, id) => {
  try {
    // Adiciona log pra verificar o conteúdo enviado
    console.log("🚀 Enviando atualização:", [...formData.entries()]);

    const response = await api.post(`/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Atualização OK:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao atualizar usuário:", error.response?.data || error);
    throw error;
  }
};


const deleteUser = (id) => {
  return api.delete(`/destroy/${id}`);
};

const logoutUser = () => {
  return api.post("/logout");
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
