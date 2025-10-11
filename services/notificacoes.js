import api from "./axios";

export const Notificacoes = async () => {
  try {
  const response = await api.get("/notificacoes"); 

  return response.data;
  } catch (error) {
    console.error("Erro ao buscar notificações:", error.response?.data || error.message);
    throw error;
  }
};

export const marcarNotificacaoComoLida = async (id) => {
  try {
    const response = await api.post(`/notificacao/${id}/ler`);
    return response.data;
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error.response?.data || error.message);
    throw error;
  }
};

export const marcarTodasNotificacoesComoLidas = async () => {
  try {
    const response = await api.post("/notificacoes/ler");
    return response.data;
  } catch (error) {
    console.error("Erro ao marcar todas notificações como lidas:", error.response?.data || error.message);
  throw error;
  }
};