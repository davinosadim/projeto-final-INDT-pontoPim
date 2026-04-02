import { z } from "zod"
import { Turno } from "../types/turno"
import { converterHorarioParaMinutos } from "../utils/time"

const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

export const createColaboradorSchema = z.object({
    nome: z.string().trim().min(1, "O nome e obrigatorio").max(100, "Nome deve ter no maximo 100 caracteres"),
    matricula: z.string().trim().min(1, "Matricula e obrigatoria").max(5, "Matricula deve ter no maximo 5 numeros"),
    cargo: z.string().trim().min(1, "Cargo e obrigatorio").max(100, "Cargo deve ter no maximo 100 caracteres"),
})