import { z } from "zod"

export const loginSchemaDTO = z.object({
    matricula: z.string().min(1, "Necessario inserir matricula"),
    senha: z.string().min(6, "Senha obrigatoria")
})

export type LoginSchemaDTO = z.infer<typeof loginSchemaDTO>