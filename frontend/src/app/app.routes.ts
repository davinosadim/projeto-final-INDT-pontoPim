import { Routes } from '@angular/router';
import { MeuPonto } from './pages/meu-ponto/meu-ponto';
import { Login } from './pages/login/login';

export const routes: Routes = [

    { path: "meuPonto", component: MeuPonto},
    { path: "login", component: Login}
];
