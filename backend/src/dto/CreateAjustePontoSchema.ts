import { z } from "zod"
import { StatusAjuste } from "../types/statusAjuste"

export const createAjustePontoSchema = z.object({
    colaboradorId: z.uuid("colaboradorId invalido"),

    data: z.coerce.date({
        error: "Data invalida"
    }),

    motivo: z
    .string()
    .trim()
    .min(1,"Motivo obrigatorio")
    .max(255, "Motivo muito longo"),

})