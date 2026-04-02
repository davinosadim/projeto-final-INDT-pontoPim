export const converterHorarioParaMinutos = (horario: string): number => {
    const [hora, minuto] = horario.split(":").map(Number)
    return hora! * 60 + minuto!
}