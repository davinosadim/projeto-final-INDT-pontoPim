import { string, z } from "zod"
import { Cargos } from "../../types/cargos"
import { Setores } from "../../types/setores"
import { createJornadaSchemaDTO } from "../jornada/CreateJornadaSchemaDTO"

const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createColaboradorSchema = z.object({
    nome: z.string().trim().min(1, "O nome é obrigatório"),
    matricula: z.string().trim().min(1, "Matrícula é obrigatória"),
    cargo: z.nativeEnum(Cargos, { error: "Cargo inválido" }),
    setor: z.nativeEnum(Setores, { error: "Setor inválido" }),
    
    jornada: createJornadaSchemaDTO, 

    ativo: z.boolean().default(true),
});



export type CreateColaboradorSchemaDTO = z.infer<typeof createColaboradorSchema>;
