import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

function rotaPorPerfil(perfil: string | null): string {
    if (perfil === 'gestor') return '/app/equipe';
    if (perfil === 'rh') return '/app/colaboradores';
    return '/app/meu-ponto';
}

export const roleGuard = (...perfisPermitidos: string[]): CanActivateFn => {
    return () => {
        const auth = inject(AuthService);
        const router = inject(Router);

        if (!auth.isLoggedIn()) {
            return router.createUrlTree(['/auth/login']);
        }

        const perfil = auth.perfil();
        if (!perfil || !perfisPermitidos.includes(perfil)) {
            return router.createUrlTree([rotaPorPerfil(perfil)]);
        }

        return true;
    };
};
