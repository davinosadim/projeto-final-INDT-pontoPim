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

  private loginService = inject(AuthService)
  private router = inject(Router)

  email = " "
  senha = " "
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {

    console.log("clicou")
    const dadosLogin = {
      email: this.email,
      senha: this.senha
    }

    this.loginService.login(dadosLogin).subscribe({
      next: (response) => {
        console.log("Login realizado:", response)
        localStorage.setItem("acessToken", response.accessToken)

        this.router.navigate(["meuPonto"])
      },
      error: (error) => {
        console.log("Erro ao fazer login", error)
      }
    })
    
  }
}
