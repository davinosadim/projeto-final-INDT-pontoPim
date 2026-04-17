import { z } from "zod"
import { TiposRegistros } from "../../types/registros"
import { Origem } from "../../types/origem";

export const createRegistroPontoSchemaDTO = z.object({
    colaboradorId: z.string().uuid("ID do colaborador inválido"),

    tipo: z.nativeEnum(TiposRegistros, {
        error: "Tipo de registro inválido"
    }),

    // Adicionado para suportar os dois valores do seu Enum
    origem: z.nativeEnum(Origem).default(Origem.SISTEMA),

    justificativa: z
        .string()
        .trim()
        .max(500, "Máximo 500 caracteres")
        .nullable()
        .optional(),
});
export type CreateRegistroPontoSchemaDTO = z.infer<typeof createRegistroPontoSchemaDTO>
