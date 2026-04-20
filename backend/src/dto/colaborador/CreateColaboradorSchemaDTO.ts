import { email, string, z } from "zod"
import { Cargos } from "../../types/cargos"
import { Setores } from "../../types/setores"
import { createJornadaSchemaDTO } from "../jornada/CreateJornadaSchemaDTO"
import { Turno } from "../../types/turno";

const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createColaboradorSchema = z.object({
    nome: z.string().trim().min(1, "O nome é obrigatório"),
    email: z.email("E-mail invalido").trim().toLowerCase(),
    matricula: z.string().trim().min(1, "Matrícula é obrigatória"),
    senha: z.string(),
    cargo: z.enum(Cargos, { error: "Cargo inválido" }),
    setor: z.enum(Setores, { error: "Setor inválido" }),
    
    jornada: z.enum(Turno, {error: "Jornada invalida"}), 

    ativo: z.boolean().default(true),
});



export type CreateColaboradorSchemaDTO = z.infer<typeof createColaboradorSchema>;
