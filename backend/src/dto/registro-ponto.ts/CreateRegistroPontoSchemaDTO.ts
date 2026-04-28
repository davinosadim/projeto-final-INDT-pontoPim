import { z } from "zod"
import { TiposRegistros } from "../../types/registros"
import { Origem } from "../../types/origem";

export const createRegistroPontoSchemaDTO = z.object({
    tipo: z.enum(TiposRegistros)
}).strict();



export type CreateRegistroPontoSchemaDTO = z.infer<typeof createRegistroPontoSchemaDTO>
