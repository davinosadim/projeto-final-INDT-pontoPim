import { z } from "zod"
import { Cargos } from "../../types/cargos"
import { Setores } from "../../types/setores"
import { Turno } from "../../types/turno";
import { UserRole } from "../../types/roles";

export const createColaboradorSchema = z.object({
    nome: z.string().trim().min(1, "O nome é obrigatório"),
    email: z.string().email("E-mail invalido").trim().toLowerCase(),
    matricula: z.string().trim().min(1, "Matrícula é obrigatória"),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    cargo: z.enum(Object.values(Cargos) as [string, ...string[]], { error: "Cargo inválido" }),
    setor: z.enum(Object.values(Setores) as [string, ...string[]], { error: "Setor inválido" }),
    jornada: z.enum(Object.values(Turno) as [string, ...string[]], { error: "Jornada inválida" }),
    perfil: z.enum(Object.values(UserRole) as [string, ...string[]], { error: "Perfil inválido" }).default(UserRole.COLABORADOR),
    ativo: z.boolean().default(true),
});



export type CreateColaboradorSchemaDTO = z.infer<typeof createColaboradorSchema>;
