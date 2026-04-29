import { Routes } from '@angular/router';
import { MeuPonto } from './pages/meu-ponto/meu-ponto';
import { Login } from './pages/login/login';
import { DashboardGestor } from './pages/dashboard-gestor/dashboard-gestor';

export const routes: Routes = [

    { path: "meuPonto", component: MeuPonto},
    { path: "auth/login", component: Login},
    { path: "app/dashboard", component: DashboardGestor}
];
