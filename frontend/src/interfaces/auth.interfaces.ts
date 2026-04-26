export interface LoginRequest {
    email: string
    senha: string
}


export interface LoginUser {
  id: string;
  nome: string;
  email: string;
  perfil: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user?: LoginUser;
}