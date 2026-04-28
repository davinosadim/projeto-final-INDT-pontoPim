import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private authService = inject(AuthService)
  private router = inject(Router)

  email = '';
  senha = '';
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {

    const dadosLogin = {
      email: this.email,
      senha: this.senha
    }

    this.authService.login(dadosLogin).subscribe({
      next: (response) => {
        console.log("Resposta login:", response)
        this.authService.salvarTokens(response)

        this.router.navigate(["meuPonto"])
      },
      error: (error) => {
        console.log("Erro ao fazer login", error)
      }
    })
    
  }
}
