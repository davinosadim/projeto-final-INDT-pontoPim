📌 PontoPIM - Sistema de Controle de Ponto e Jornada

Sistema web para registro digital de ponto e controle de jornada de colaboradores, com cálculo automático de horas trabalhadas, horas extras e atrasos.

O projeto simula o contexto real de empresas do Polo Industrial de Manaus, onde há múltiplos turnos e necessidade de controle rigoroso da jornada.

📖 Visão Geral

O PontoPIM substitui processos manuais e planilhas por um sistema digital que:

Registra batidas de ponto em tempo real

Calcula automaticamente horas trabalhadas

Identifica atrasos e horas extras

Gera histórico e espelho mensal

Fornece visão consolidada para gestores

👥 Perfis de Usuário

Colaborador

Registra batidas de ponto

Consulta histórico e saldo de horas

Gestor

Acompanha equipe

Visualiza atrasos e horas extras


RH

Gerencia colaboradores

Gera relatórios e espelho de ponto

🚀 Funcionalidades
🔐 Autenticação

Login com matrícula e senha

Geração de JWT

Controle de acesso por perfil

⏱️ Registro de Ponto

Registro de batidas (entrada, almoço, saída)

Identificação automática da próxima batida

Timestamp gerado pelo servidor

📊 Cálculo de Jornada

Horas trabalhadas

Horas extras

Atrasos em minutos

📅 Histórico e Relatórios

Histórico por período

Espelho mensal com totais

Status diário (completo, incompleto, falta)

👨‍💼 Gestão de Colaboradores

Cadastro e edição

Definição de jornada (horários e carga horária)

Ativação/desativação

📈 Dashboard

Colaboradores presentes

Atrasos do dia

Horas extras da semana

Saldos negativos

🛠️ Tecnologias

Backend

Node.js
Express
TypeORM
PostgreSQL
Zod (validação)

Frontend

Angular
Tailwind CSS
