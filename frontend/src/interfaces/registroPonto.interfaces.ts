export interface RegistroResponse {
  mensagem: string;
  registro: Registro;
}

export interface Registro {
  id: string;
  tipo: string;
  timestamp: string;
  origem: string;
}