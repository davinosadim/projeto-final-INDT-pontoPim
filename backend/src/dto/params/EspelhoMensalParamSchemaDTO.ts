import { minLength, z } from "zod"

export const espelhoMensalParamSchemaDTO = z.object({
    id: z.coerce.number()
    .int("id deve ser inteiro")
    .positive("id invalido"),

    mes: z.coerce.number()
    .int("mes deve ser inteiro")
    .min(1, "Mes deve ser entre 1 e 12")
    .max(12, "Mes deve ser entre 1 e 12")
})

export type EspelhoMensalParamSchemaDTO = z.infer<typeof espelhoMensalParamSchemaDTO>