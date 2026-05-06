import { z } from "zod";
import { AppError } from "../../../errors/AppError";

const listarHistoricoPontoParamsSchema = z.object({
    id: z.string().uuid("O ID fornecido e invalido"),
});

const listarHistoricoPontoQuerySchema = z.object({
    periodo: z.enum(["semana", "mes"]).optional().default("semana"),
});

export type ListarHistoricoPontoParamsDTO = z.infer<typeof listarHistoricoPontoParamsSchema>;
export type ListarHistoricoPontoQueryDTO = z.infer<typeof listarHistoricoPontoQuerySchema>;

export function parseListarHistoricoPontoParams(params: unknown): ListarHistoricoPontoParamsDTO {
    const result = listarHistoricoPontoParamsSchema.safeParse(params);
    if (!result.success) {
        throw new AppError("Parametros invalidos", 400, result.error);
    }

    return result.data;
}

export function parseListarHistoricoPontoQuery(query: unknown): ListarHistoricoPontoQueryDTO {
    const result = listarHistoricoPontoQuerySchema.safeParse(query);
    if (!result.success) {
        throw new AppError("Periodo invalido", 400, result.error);
    }

    return result.data;
}
