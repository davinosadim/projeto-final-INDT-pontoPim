import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './guards/auth.guard';
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
        canActivate: [authGuard],
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
                path: 'colaboradores',
                canActivate: [roleGuard('rh')],
                loadComponent: () => import('./pages/colaboradores/colaboradores').then(m => m.Colaboradores)
            },
            { path: '', redirectTo: 'meu-ponto', pathMatch: 'full' }
        ]
    },

    { path: '**', redirectTo: 'auth/login' }
];
