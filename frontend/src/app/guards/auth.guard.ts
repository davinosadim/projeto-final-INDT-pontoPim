import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    return router.createUrlTree(['/auth/login']);
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
