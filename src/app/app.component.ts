import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
// @NgModule({
//   declarations: [
//     // ... seus componentes
//   ],
//   imports: [ // Adicione FormsModule aqui
//     // ... outros módulos
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
export class AppComponent {
  title = 'ProjetoOG';
}
