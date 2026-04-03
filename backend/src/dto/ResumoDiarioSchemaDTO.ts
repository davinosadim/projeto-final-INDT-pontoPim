import { z } from "zod"
import { StatusResumo } from "../types/statusResumo"

export const resumoDiariSchemaDTO = z.object({
    colaboradorId: z.uuid("Colaborador invalido"),

    data: z.coerce.date(),

    horasTrabalhadas: z
    .number()
    .min(0, "Horas trabalhadas nao podem ser negativas"),

    horasEsperadas: z
    .number()
    .positive("Horas esperadas devem ser maiores que zero"),

    horasExtras: z
    .number()
    .min(0, "Horas extras nao podem ser negativas"),

    atrasoMinutos: z
    .number()
    .int("Atraso deve ser um numero inteiro")
    .min(0, "Atraso nao pode ser negativo"),

    status: z.enum(StatusResumo, {
        error: "Status invalido"
    })
})

export type ResumoDiaripSchemaDTO = z.infer<typeof resumoDiariSchemaDTO>