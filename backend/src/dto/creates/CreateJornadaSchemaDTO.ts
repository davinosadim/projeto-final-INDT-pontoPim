import { z } from "zod"
import { Turno } from "../../types/turno"
import { converterHorarioParaMinutos } from "../../utils/time"

const horarioRegex = /^([01]\d|2[0-3]):[0-5]\d$/

export const createJornadaSchemaDTO = z.object({
    turno: z.enum(Turno, {
        error: "Turno invalido"
    }),

    cargaHorariaDia: z.coerce
    .number()
    .positive("A carga horaria deve ser maior que zero")
    .min(4, "A carga horaria deve ser no minimo de 4 horas")
    .max(12, "A carga horaria deve ser no maximo de 12 horas"),

    horarioEntrada: z
    .string()
    .regex(horarioRegex, "Horario de entrada invalido. Use HH:MM"),

    horarioSaida: z
    .string()
    .regex(horarioRegex, "Horario de saida invalido. Use HH:MM")
}).superRefine((data, ctx) => {
    const entrada = converterHorarioParaMinutos(data.horarioEntrada)
    const saida = converterHorarioParaMinutos(data.horarioSaida)

    if(data.turno !== Turno.NOITE && saida <= entrada) {
        ctx.addIssue({
            code: "custom",
            path: ["horarioSaida"],
            message: "O horario de saida deve ser maior que o horario de entrada"
        })
    }

})

export type CreateJornadaSchemaDTO = z.infer<typeof createJornadaSchemaDTO>