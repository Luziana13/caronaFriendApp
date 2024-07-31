import axios from 'axios';
import { API_BASE_URL } from '../config';
import { getToken, getUserId } from './tokenService';

// Configurando o Axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptando requisições para adicionar o token de autenticação
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Função para chamadas Fetch
const apiFetch = async (url, options = {}) => {
  const token = await getToken();
  const userId = await getUserId();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.ok) {
    const data = await response.json();
    return { ...data, userId };
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro na solicitação');
  }
};

export { api, apiFetch };
