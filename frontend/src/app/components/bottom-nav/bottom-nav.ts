import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-bottom-nav',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './bottom-nav.html',
    styleUrl: './bottom-nav.css',
})
export class BottomNav {
    private authService = inject(AuthService);

    readonly items = computed(() => {
        const perfil = this.authService.perfil();
        if (perfil === 'gestor') {
            return [{ label: 'Equipe', icon: 'groups', route: '/app/equipe' }];
        }
        if (perfil === 'rh') {
            return [{ label: 'Colaboradores', icon: 'badge', route: '/app/colaboradores' }];
        }
        return [{ label: 'Ponto', icon: 'fingerprint', route: '/app/meu-ponto' }];
    });
}
