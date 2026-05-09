import { RegistroPonto } from "../entities/RegistroPonto";
import { TiposRegistros } from "../types/registros";
import { StatusResumo } from "../types/statusResumo";

export const QUANTIDADE_BATIDAS_DIA = 4;

export function horarioParaMinutos(horario: string): number {
    const [horas, minutos] = horario.split(":").map(Number);
    return (horas ?? 0) * 60 + (minutos ?? 0);
}

export function calcularResumoPonto(
    registros: RegistroPonto[],
    cargaHorariaDia: number,
    horarioEntrada: string
) {
    const entrada = registros.find(r => r.tipo === TiposRegistros.ENTRADA);
    const saidaAlmoco = registros.find(r => r.tipo === TiposRegistros.SAIDA_ALMOCO);
    const retornoAlmoco = registros.find(r => r.tipo === TiposRegistros.RETORNO_ALMOCO);
    const saida = registros.find(r => r.tipo === TiposRegistros.SAIDA);

    let minutosTrabalhados = 0;

    if (entrada && saida) {
        const totalMs = saida.timestamp.getTime() - entrada.timestamp.getTime();
        const almocoMs = saidaAlmoco && retornoAlmoco
            ? retornoAlmoco.timestamp.getTime() - saidaAlmoco.timestamp.getTime()
            : 0;

        minutosTrabalhados = Math.max(0, Math.round((totalMs - almocoMs) / (1000 * 60)));
    }

    const atrasoMinutos = entrada
        ? Math.max(0, entrada.timestamp.getHours() * 60 + entrada.timestamp.getMinutes() - horarioParaMinutos(horarioEntrada))
        : 0;

    const jornadaMinutos = Math.round(cargaHorariaDia * 60);
    const registroCompleto = registros.length === QUANTIDADE_BATIDAS_DIA;
    const horasExtrasMinutos = registroCompleto ? Math.max(0, minutosTrabalhados - jornadaMinutos) : 0;

    let status: StatusResumo;
    if (registroCompleto) {
        status = StatusResumo.COMPLETO;
    } else if (registros.length > 0) {
        status = StatusResumo.INCOMPLETO;
    } else {
        status = StatusResumo.FALTA;
    }

    return {
        horasTrabalhadas: Number((minutosTrabalhados / 60).toFixed(2)),
        horasExtras: Number((horasExtrasMinutos / 60).toFixed(2)),
        atrasoMinutos,
        minutosTrabalhados,
        horasExtrasMinutos,
        status,
    };
}
