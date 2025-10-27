import api from "./axios";

const fetchEsportes = () => {
  const response = api.get("/esporte");
  return response;
};

const fetchEsportesPerfil = () => {
  const response = api.get("/optionsEsportes");
  return response;
};

const fetchEsporteById = (id) => {
  const response = api.get(`/esporte/${id}`);
  return response;
};

export { fetchEsportes, fetchEsporteById, fetchEsportesPerfil };
