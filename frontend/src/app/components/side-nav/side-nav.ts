import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-side-nav',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './side-nav.html',
    styleUrl: './side-nav.css',
})
export class SideNav {
    private authService = inject(AuthService);
    private router = inject(Router);

    readonly usuario = computed(() => this.authService.usuario());

    readonly iniciais = computed(() => {
        const nome = this.usuario()?.nome ?? '';
        return nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
    });

    readonly menuItems = computed(() => {
        const perfil = this.authService.perfil();
        if (perfil === 'gestor') {
            return [
                { label: 'Equipe', icon: 'groups', route: '/app/equipe' },
            ];
        }
        if (perfil === 'rh') {
            return [
                { label: 'Colaboradores', icon: 'badge', route: '/app/colaboradores' },
            ];
        }
        return [
            { label: 'Meu Ponto', icon: 'fingerprint', route: '/app/meu-ponto' },
        ];
    });

    sair() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}
