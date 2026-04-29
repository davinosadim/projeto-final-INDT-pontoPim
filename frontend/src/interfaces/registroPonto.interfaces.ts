export interface RegistroBatida {
    id: string
    tipo: TipoBatida
    timestamp: string
    origem: string
}

export type TipoBatida = 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida'

export interface ResumoDiario {
    horasTrabalhadas: number
    horasExtras: number
    horasEsperadas: number
    atrasoMinutos: number
    status: 'completo' | 'incompleto' | 'falta' | 'afastamento'
}

export interface PontoHojeResponse {
    status: string
    data: {
        registros: RegistroBatida[]
        proximaBatida: TipoBatida | null
        resumo: ResumoDiario | null
    }
}

export interface RegistrarPontoResponse {
    status: string
    data: {
        mensagem: string
        registro: RegistroBatida
        registroHoje: RegistroBatida[]
        batidaRegistrada: TipoBatida
        proximaBatida: TipoBatida | null
    }
}
