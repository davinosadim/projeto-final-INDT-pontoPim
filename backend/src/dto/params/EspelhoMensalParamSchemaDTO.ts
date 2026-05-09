import { z } from "zod";
import { AppError } from "../../errors/AppError";

export const espelhoMensalParamSchemaDTO = z.object({
    id: z.string().uuid("ID do colaborador invalido"),
    mes: z.coerce.number().int().min(1).max(12),
});

export type EspelhoMensalParamSchemaDTO = z.infer<typeof espelhoMensalParamSchemaDTO>;

export function parseEspelhoMensalParams(params: unknown): EspelhoMensalParamSchemaDTO {
    const result = espelhoMensalParamSchemaDTO.safeParse(params);

    if (!result.success) {
        throw new AppError("Parametros invalidos", 400, result.error);
    }

    return result.data;
}
