import { z } from "zod"

export const createRegistroPontoSchemaDTO = z.object({
    colaboradorId: z.uuid("Colaborador invalido"),
})

export type CreateRegistroPontoSchemaDTO = z.infer<typeof createRegistroPontoSchemaDTO>