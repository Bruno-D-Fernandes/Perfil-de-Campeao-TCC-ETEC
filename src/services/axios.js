import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

const api = axios.create({
  baseURL: `${API_URL}/api/usuario/`,
  timeout: 20000,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export default api;
