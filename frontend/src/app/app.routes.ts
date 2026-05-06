import { Routes } from '@angular/router';
import { authChildGuard, authGuard, authMatchGuard, publicGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

    {
        path: 'auth/login',
        canActivate: [publicGuard],
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },

    {
        path: 'app',
        canMatch: [authMatchGuard],
        canActivate: [authGuard],
        canActivateChild: [authChildGuard],
        children: [
            {
                path: 'meu-ponto',
                canActivate: [roleGuard('colaborador')],
                loadComponent: () => import('./pages/meu-ponto/meu-ponto').then(m => m.MeuPonto)
            },
            {
                path: 'equipe',
                canActivate: [roleGuard('gestor', 'rh')],
                loadComponent: () => import('./pages/equipe/equipe').then(m => m.Equipe)
            },
            {
                path: 'aprovacoes',
                canActivate: [roleGuard('gestor')],
                loadComponent: () => import('./pages/aprovacoes/aprovacoes').then(m => m.Aprovacoes)
            },
            {
                path: 'colaboradores',
                canActivate: [roleGuard('rh')],
                loadComponent: () => import('./pages/colaboradores/colaboradores').then(m => m.Colaboradores)
            },
            {
                path: 'colaboradores/:id/ponto',
                canActivate: [roleGuard('rh', 'gestor', 'colaborador')],
                loadComponent: () => import('./pages/historico-ponto-colaborador/historico-ponto-colaborador').then(m => m.HistoricoPontoColaborador)
            },
            { path: '', redirectTo: 'meu-ponto', pathMatch: 'full' }
        ]
    },

    { path: '**', redirectTo: 'auth/login' }

];
