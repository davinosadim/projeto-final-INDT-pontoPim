import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    readonly form = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
    });

    readonly carregando = signal(false);
    readonly erroLogin = signal<string | null>(null);
    readonly mostrarSenha = signal(false);

    toggleSenha() {
        this.mostrarSenha.update(v => !v);
    }

    login() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.carregando.set(true);
        this.erroLogin.set(null);

        this.authService.login(this.form.getRawValue()).subscribe({
            next: (response) => {
                this.authService.salvarTokens(response);
                const perfil = response.data.usuario.perfil;
                if (perfil === 'gestor') {
                    this.router.navigateByUrl('/app/equipe');
                } else if (perfil === 'rh') {
                    this.router.navigateByUrl('/app/colaboradores');
                } else {
                    this.router.navigateByUrl('/app/meu-ponto');
                }
            },
            error: (error) => {
                this.carregando.set(false);
                const msg = error?.error?.message;
                this.erroLogin.set(msg ?? 'Email ou senha incorretos');
            }
        });
    }

    get emailCtrl() { return this.form.controls.email; }
    get senhaCtrl() { return this.form.controls.senha; }
}
