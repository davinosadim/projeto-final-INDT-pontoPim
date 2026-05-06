import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

function validarAutenticacao() {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    return router.createUrlTree(['/auth/login']);
}

export const authGuard: CanActivateFn = () => {
    return validarAutenticacao();
};

export const authChildGuard: CanActivateChildFn = () => {
    return validarAutenticacao();
};

export const authMatchGuard: CanMatchFn = () => {
    return validarAutenticacao();
};

export const publicGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) return true;

    const perfil = authService.perfil();
    if (perfil === 'gestor') return router.createUrlTree(['/app/equipe']);
    if (perfil === 'rh') return router.createUrlTree(['/app/colaboradores']);
    return router.createUrlTree(['/app/meu-ponto']);
};
