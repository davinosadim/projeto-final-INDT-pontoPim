import { z } from "zod";
import { AppError } from "../../../errors/AppError";

const criarAjustePontoParamsSchema = z.object({
    id: z.string().uuid("O ID fornecido e invalido"),
});

const criarAjustePontoBodySchema = z.object({
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data invalida"),
    motivo: z.string().trim().min(1, "Motivo e obrigatorio").max(255, "Motivo muito longo"),
    batidasSolicitadas: z.object({
        entrada: z.string().regex(/^\d{2}:\d{2}$/, "Entrada invalida").nullable().optional(),
        saidaAlmoco: z.string().regex(/^\d{2}:\d{2}$/, "Saida almoco invalida").nullable().optional(),
        retornoAlmoco: z.string().regex(/^\d{2}:\d{2}$/, "Retorno invalido").nullable().optional(),
        saida: z.string().regex(/^\d{2}:\d{2}$/, "Saida invalida").nullable().optional(),
    }).refine(
        batidas => Object.values(batidas).some(Boolean),
        "Informe ao menos uma batida para corrigir"
    ),
});

export type CriarAjustePontoParamsDTO = z.infer<typeof criarAjustePontoParamsSchema>;
export type CriarAjustePontoBodyDTO = z.infer<typeof criarAjustePontoBodySchema>;

export function parseCriarAjustePontoParams(params: unknown): CriarAjustePontoParamsDTO {
    const result = criarAjustePontoParamsSchema.safeParse(params);
    if (!result.success) {
        throw new AppError("Parametros invalidos", 400, result.error);
    }

    return result.data;
}

export function parseCriarAjustePontoBody(body: unknown): CriarAjustePontoBodyDTO {
    const result = criarAjustePontoBodySchema.safeParse(body);
    if (!result.success) {
        throw new AppError("Dados invalidos", 400, result.error);
    }

    return result.data;
}
