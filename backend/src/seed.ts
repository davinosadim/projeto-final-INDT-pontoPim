import "reflect-metadata"
import * as dotenv from "dotenv"
import { hash } from "bcryptjs"
import { appDataSource } from "./database/data-source"
import { Jornada } from "./entities/Jornada"
import { Colaborador } from "./entities/Colaborador"
import { Turno } from "./types/turno"
import { Cargos } from "./types/cargos"
import { Setores } from "./types/setores"
import { UserRole } from "./types/roles"

dotenv.config()

async function seed() {
    await appDataSource.initialize()
    console.log("Banco conectado. Iniciando seed...")

    const jornadaRepo = appDataSource.getRepository(Jornada)
    const colaboradorRepo = appDataSource.getRepository(Colaborador)

    // Jornadas
    const jornadas = await jornadaRepo.save([
        { turno: Turno.MANHA, cargaHorariaDia: 8, horarioEntrada: "07:00", horarioSaida: "16:00" },
        { turno: Turno.TARDE, cargaHorariaDia: 8, horarioEntrada: "14:00", horarioSaida: "23:00" },
        { turno: Turno.ADMINISTRATIVO, cargaHorariaDia: 8, horarioEntrada: "08:00", horarioSaida: "17:00" },
    ])

    const jornManha = jornadas[0]!
    const jornTarde = jornadas[1]!
    const jornAdmin = jornadas[2]!

    // Colaboradores
    const senhaColaborador = await hash("Senha@123", 10)
    const senhaGestor = await hash("Gestor@123", 10)

    const colaboradores = [
        {
            nome: "Carlos Souza",
            email: "carlos.souza@pim.com",
            matricula: "COL001",
            senha: senhaColaborador,
            cargo: Cargos.OPERADOR,
            setor: Setores.PRODUCAO,
            perfil: UserRole.COLABORADOR,
            ativo: true,
            jornada: jornManha,
        },
        {
            nome: "Ana Lima",
            email: "ana.lima@pim.com",
            matricula: "COL002",
            senha: senhaColaborador,
            cargo: Cargos.ASSISTENTE_PRODUCAO,
            setor: Setores.PRODUCAO,
            perfil: UserRole.COLABORADOR,
            ativo: true,
            jornada: jornTarde,
        },
        {
            nome: "Roberto Gestor",
            email: "roberto.gestor@pim.com",
            matricula: "GES001",
            senha: senhaGestor,
            cargo: Cargos.SUPERVISOR,
            setor: Setores.PRODUCAO,
            perfil: UserRole.GESTOR,
            ativo: true,
            jornada: jornAdmin,
        },
        {
            nome: "Maria RH",
            email: "maria.rh@pim.com",
            matricula: "RH001",
            senha: await hash("Rh@12345", 10),
            cargo: Cargos.ANALISTA_RH,
            setor: Setores.RECURSOS_HUMANOS,
            perfil: UserRole.RH,
            ativo: true,
            jornada: jornAdmin,
        },
    ]

    for (const dados of colaboradores) {
        const existente = await colaboradorRepo.findOne({ where: { email: dados.email } })
        if (!existente) {
            await colaboradorRepo.save(colaboradorRepo.create(dados))
            console.log(`Colaborador criado: ${dados.email}`)
        } else {
            console.log(`Colaborador ja existe: ${dados.email}`)
        }
    }

    console.log("\nSeed concluido! Credenciais:")
    console.log("  Colaborador: carlos.souza@pim.com / Senha@123")
    console.log("  Colaborador: ana.lima@pim.com / Senha@123")
    console.log("  Gestor:      roberto.gestor@pim.com / Gestor@123")
    console.log("  RH:          maria.rh@pim.com / Rh@12345")

    await appDataSource.destroy()
}

seed().catch((err) => {
    console.error("Erro no seed:", err)
    process.exit(1)
})
