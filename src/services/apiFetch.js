import { API_URL } from '../config';
import { getToken } from './tokenService';

const apiFetch = async (url, options = {}) => {
  const token = await getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } 

  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('Content-Type');
    if (response.status == 200) {
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return response;
      }
    } else {
      let errorMessage = 'Erro na solicitação';

      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else if (contentType && contentType.includes('text/plain')) {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('API Fetch Error:', error.message);
    throw  error.message;
  }
};

export { apiFetch };
