import { z } from "zod"
import { StatusResumo } from "../../types/statusResumo"

export const resumoDiariSchemaDTO = z.object({
    colaboradorId: z.string().uuid("Colaborador inválido"),
    data: z.coerce.date(),
    
    horasTrabalhadas: z.number().min(0),
    
    jornadaId: z.string().uuid("Jornada inválida"), 
    
    horaExtraId: z.string().uuid().optional().nullable(),

    atrasoMinutos: z.number().int().min(0),
    
    status: z.nativeEnum(StatusResumo, {
        error: "Status inválido"
    })
});


export type ResumoDiaripSchemaDTO = z.infer<typeof resumoDiariSchemaDTO>