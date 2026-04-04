import { z } from "zod"
import { Turno } from "../../types/turno"
import { converterHorarioParaMinutos } from "../../utils/time"

const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

export const createColaboradorSchema = z.object({
    nome: z.string().trim().min(1, "O nome e obrigatorio").max(100, "Nome deve ter no maximo 100 caracteres"),
    matricula: z.string().trim().min(1, "Matricula e obrigatoria").max(5, "Matricula deve ter no maximo 5 numeros"),
    cargo: z.string().trim().min(1, "Cargo e obrigatorio").max(100, "Cargo deve ter no maximo 100 caracteres"),
    setor: z.string().min(1, "Nome e obrigatorio"),
    setorId: z.uuid("Setor invalido"),
    turno: z.enum(Turno),

    cargaHorariaDia: z.coerce.number()
    .positive("Carga horaria diaria deve ser maior que zero")
    .min(4, "Carga horaria deve ser no minimo 4 horas")
    .max(12, "Carga horaria deve ser no maximo 12 horas"),

    horarioEntrada: z.string().regex(horarioRegex, "Horario de entrada invalido. Use HH:mm"),
    horarioSaida: z.string().regex(horarioRegex, "Horario de saida invalido. Use HH:mm"),

    ativo: z.boolean().default(true),
}).superRefine((data, ctx) => {
    const entrada = converterHorarioParaMinutos(data.horarioEntrada)
    const saida = converterHorarioParaMinutos(data.horarioSaida)

    if(entrada === saida) {
        ctx.addIssue({
            code: "custom",
            path: ["HorarioSaida"],
            message: "Horario de saida nao pode ser igual ao horario de entrada"
        })
    }
})

export type CreateColaboradorSchemaDTO = z.infer<typeof createColaboradorSchema>