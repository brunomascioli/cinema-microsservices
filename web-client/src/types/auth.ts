export interface User {
  id: string;
  email: string;
  role: 'CLIENT' | 'ADMIN' | 'USER'; // Adicionei USER que é o padrão
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}