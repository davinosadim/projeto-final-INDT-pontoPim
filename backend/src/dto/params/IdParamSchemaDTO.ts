import { z } from "zod"

export const idParamSchemaDTO = z.object({
    id: z.coerce.number()
    .int("O id deve ser um numero inteiro")
    .positive("O id deve ser maior que zero")
})

export type IdParamSchemaDTO = z.infer<typeof idParamSchemaDTO>