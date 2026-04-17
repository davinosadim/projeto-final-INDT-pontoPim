import { minLength, z } from "zod"

export const espelhoMensalParamSchemaDTO = z.object({
    id: z.string().uuid("ID do colaborador inválido"),
    mes: z.coerce.number().int().min(1).max(12),
    ano: z.coerce.number().int().min(2020) 
});

export type EspelhoMensalParamSchemaDTO = z.infer<typeof espelhoMensalParamSchemaDTO>