import { z } from "zod"

export const createRegistroPontoSchemaDTO = z.object({
    colaboradorId: z.uuid("Colaborador invalido"),

    justificativa: z
    .string()
    .trim()
    .max(500, "A justificativa deve ter no maximo 500 caracteres")
    .nullable()
    .optional(),

})