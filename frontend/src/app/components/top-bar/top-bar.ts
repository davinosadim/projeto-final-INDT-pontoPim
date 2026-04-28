import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-top-bar',
    imports: [],
    templateUrl: './top-bar.html',
    styleUrl: './top-bar.css',
})
export class TopBar {
    private authService = inject(AuthService);
    private router = inject(Router);

    readonly appName = 'PontoPim';

    readonly iniciais = computed(() => {
        const nome = this.authService.usuario()?.nome ?? '';
        return nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() || 'U';
    });

    sair() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}
