export function obterInicioEFimDoDia(data = new Date()) {
    const inicio = new Date(data)
    inicio.setHours(0, 0, 0, 0)

    const fim = new Date(data)
    fim.setHours(23, 59, 59, 999)

    return { inicio, fim}
}