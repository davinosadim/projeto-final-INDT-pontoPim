export interface LoginRequest {
    email: string
    senha: string
}

export interface UsuarioLogado {
    id: string
    nome: string
    email: string
    perfil: 'colaborador' | 'gestor' | 'rh'
}

export interface LoginResponse {
    status: string
    data: {
        acessToken: string
        refreshToken: string
        usuario: UsuarioLogado
    }
}

export interface TokenPayload {
    sub: string
    email: string
    nome: string
    perfil: 'colaborador' | 'gestor' | 'rh'
    type: string
    exp: number
    iat: number
}
