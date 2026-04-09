import { z } from "zod"


export const loginSchemaDTO = z.object({
    email: z.email("E-mail invalido").trim().toLowerCase(),
    senha: z.string().min(6, "Senha obrigatoria")
    
  
})

export type LoginSchemaDTO = z.infer<typeof loginSchemaDTO>