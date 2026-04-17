import { z } from "zod"
import { StatusAjuste } from "../../types/statusAjuste"

const statusValues = Object.values(StatusAjuste) as [string, ...string[]];

export const createAjustePontoSchema = z.object({
    colaboradorId: z.string().uuid({ message: "ID do colaborador inválido" }),

    data: z.coerce.date({
        error: "Data inválida",
    }),

    motivo: z
    .string()
    .trim()
    .min(1,"Motivo é obrigatório")
    .max(255, "Motivo muito longo"),

})

export type CreateAjustePontoSchemaDTO = z.infer<typeof createAjustePontoSchema>

export const updateStatusAjustePonto = z.object({
    status: z.enum(statusValues, {
        error: "Status inválido" 
    }),
    aprovadoPor: z.string().uuid({ message: "Aprovador inválido" }),

    comentario: z.string().trim().min(1, "Comentário é obrigatório").max(255, "Comentário muito longo").nullable()
}).superRefine((data, ctx) => {
    if (data.status === StatusAjuste.REJEITADO && (!data.comentario || data.comentario.trim() === "")) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["comentario"],
            message: "Comentário é obrigatório ao rejeitar um ajuste"
        })
    }
})