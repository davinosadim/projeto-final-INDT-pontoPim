import { z } from "zod";
import { AppError } from "../../../errors/AppError";
import { StatusAjuste } from "../../../types/statusAjuste";

const listarAjustePontoQuerySchema = z.object({
    status: z.enum([StatusAjuste.PENDENTE, StatusAjuste.APROVADO, StatusAjuste.REJEITADO]).optional(),
});

export type ListarAjustePontoQueryDTO = z.infer<typeof listarAjustePontoQuerySchema>;

export function parseListarAjustePontoQuery(query: unknown): ListarAjustePontoQueryDTO {
    const result = listarAjustePontoQuerySchema.safeParse(query);
    if (!result.success) {
        throw new AppError("Filtros invalidos", 400, result.error);
    }

    return result.data;
}
