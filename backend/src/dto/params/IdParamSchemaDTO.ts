import { z } from "zod"

export const idParamSchemaDTO = z.object({
    id: z.string().uuid("O ID fornecido é inválido")
});


export type IdParamSchemaDTO = z.infer<typeof idParamSchemaDTO>