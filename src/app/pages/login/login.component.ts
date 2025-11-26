import { Component, OnInit, inject } from '@angular/core';
import { ServiceOneService } from '../../service/service-one.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  mensagemErro: string = '';

  constructor(
    private router: Router,
    private loginService: ServiceOneService
  ) {}

  efetuarLogin() {
    this.loginService.loginHome(this.email, this.senha).subscribe({
      next: (resposta) => {
        // Se der certo: salva o token e vai pro dashboard
        this.loginService.saveToken(resposta);
        localStorage.setItem('logged', 'true');
        this.router.navigate(['/home']);
      },
      error: (erro) => {
        // Se der erro: mostra mensagem
        this.mensagemErro = 'Usuário ou senha incorretos!';
        alert(this.mensagemErro);
      },
    });
  }
}
