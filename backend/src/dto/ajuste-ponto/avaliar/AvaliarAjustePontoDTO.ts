import { z } from "zod";
import { AppError } from "../../../errors/AppError";
import { StatusAjuste } from "../../../types/statusAjuste";

const avaliarAjustePontoParamsSchema = z.object({
    ajusteId: z.string().uuid("O ID da solicitacao e invalido"),
});

const avaliarAjustePontoBodySchema = z.object({
    status: z.enum([StatusAjuste.APROVADO, StatusAjuste.REJEITADO]),
    comentario: z.string().trim().max(255, "Comentario muito longo").nullable().optional(),
});

export type AvaliarAjustePontoParamsDTO = z.infer<typeof avaliarAjustePontoParamsSchema>;
export type AvaliarAjustePontoBodyDTO = z.infer<typeof avaliarAjustePontoBodySchema>;

export function parseAvaliarAjustePontoParams(params: unknown): AvaliarAjustePontoParamsDTO {
    const result = avaliarAjustePontoParamsSchema.safeParse(params);
    if (!result.success) {
        throw new AppError("Parametros invalidos", 400, result.error);
    }

    return result.data;
}

export function parseAvaliarAjustePontoBody(body: unknown): AvaliarAjustePontoBodyDTO {
    const result = avaliarAjustePontoBodySchema.safeParse(body);
    if (!result.success) {
        throw new AppError("Dados invalidos", 400, result.error);
    }

    return result.data;
}
