import { z } from "zod"

export const createRegistroPontoSchemaDTO = z.object({}).strict()

export type CreateRegistroPontoSchemaDTO = z.infer<typeof createRegistroPontoSchemaDTO>