import axios from 'axios';
import { LoginResponse } from '../types/auth';

const AUTH_API_URL = 'http://localhost:3001';

export const authApi = axios.create({
  baseURL: AUTH_API_URL,
});

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Chama a rota de login do backend
    const response = await authApi.post<LoginResponse>('/auth/login', { email, password });
    
    // Salva o token no navegador
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw new Error('Falha ao conectar. Verifique email/senha ou se o backend está rodando.');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};