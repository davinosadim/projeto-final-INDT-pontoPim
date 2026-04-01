import { z } from "zod"
import { UserRole } from "../types/roles"


export const createUserSchema = z.object({
    nome: z.string().trim().min(1, "Nome e obrigatorio").max(100, "Nome deve ter no maximo 100 caracteres"),
    email: z.email("E-mail invalido").trim().toLowerCase(),
    senha: z.string().min(6).refine((s) => /[A-Z]/.test(s), {
        error: "A senha deve conter ao menos 1 letra maiuscula"
    })
    .refine((s) => /[a-z]/.test(s), {
        error: "A senha deve conter ao menos 1 letra minuscula"
    })
    .refine((s) => /[^A-Za-z0-9]/.test(s), {
        error: "A senha deve conter ao menos 1 caracter especial"
    })
    .refine((s) => /[0-9]/.test(s), {
        error: "A senha deve conter ao menos 1 numero"
    }),
    role: z.enum(UserRole)

})

export type CreateUserSchemaDTO = z.infer<typeof createUserSchema>