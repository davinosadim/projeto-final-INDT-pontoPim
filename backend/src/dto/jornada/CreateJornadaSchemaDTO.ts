import { z } from "zod"
import { Turno } from "../../types/turno"
import { converterHorarioParaMinutos } from "../../utils/time"

const horarioRegex = /^([01]\d|2[0-3]):[0-5]\d$/

export const createJornadaSchemaDTO = z.object({
    turno: z.nativeEnum(Turno, {
        error: "Turno inválido"
    }),

    cargaHorariaDia: z.coerce
        .number()
        .positive("A carga horária deve ser maior que zero")
        .min(4, "Mínimo 4 horas")
        .max(12, "Máximo 12 horas"),

    horarioEntrada: z.string().regex(horarioRegex, "Formato HH:mm"),
    horarioSaida: z.string().regex(horarioRegex, "Formato HH:mm")
}).superRefine((data, ctx) => {
    const entrada = converterHorarioParaMinutos(data.horarioEntrada)
    const saida = converterHorarioParaMinutos(data.horarioSaida)

    // Sua lógica para turno noturno está ótima!
    if(data.turno !== Turno.NOITE && saida <= entrada) {
        ctx.addIssue({
            code: "custom",
            path: ["horarioSaida"],
            message: "O horário de saída deve ser maior que o de entrada"
        })
    }
});

export type CreateJornadaDTO = z.infer<typeof createJornadaSchemaDTO>;
