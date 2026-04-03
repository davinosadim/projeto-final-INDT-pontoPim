import { z } from "zod"
import { StatusAjuste } from "../types/statusAjuste"

export const createAjustePontoSchema = z.object({
    colaboradorId: z.uuid("colaboradorId invalido"),

    data: z.coerce.date({
        error: "Data invalida"
    }),

    motivo: z
    .string()
    .trim()
    .min(1,"Motivo obrigatorio")
    .max(255, "Motivo muito longo"),

})

export type CreateAjustePontoSchemaDTO = z.infer<typeof createAjustePontoSchema>

export const updateStatusAjustePonto = z.object({
    status: z.enum(StatusAjuste),
    aprovadoPor: z.uuid("aprovador invalido"),
    comentario: z.string().trim().min(1, "Motivo obrigatorio").max(255, "Comentario muito longo").nullable()
}).superRefine((data, ctx) => {
    if (data.status === StatusAjuste.REJEITADO && !data.comentario) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["comentario"],
            message: "Comentario e obrigatorio ao rejeitar um ajuste"

        })
    }
})