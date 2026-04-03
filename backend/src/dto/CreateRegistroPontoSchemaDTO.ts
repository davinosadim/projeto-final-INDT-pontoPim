import { z } from "zod"
import { TiposRegistros } from "../types/registros"

export const createRegistroPontoSchemaDTO = z.object({
    colaboradorId: z.uuid("Colaborador invalido"),

    tipo: z.enum(TiposRegistros, {
        error: "Tipo de registro invalido"
    }),

    justificativa: z
    .string()
    .trim()
    .max(500, "A justificativa deve ter no maximo 500 caracteres")
    .nullable()
    .optional(),

})