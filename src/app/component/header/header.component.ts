import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router) {}
  isLogout = false;

  goTo(route: string) {
    this.closeSidebar(); // fecha o menu se quiser
    this.router.navigate([route]);
  }

  sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update(prev => !prev);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  msgLogout(){
    if(localStorage.getItem('logged') === 'true'){
      localStorage.setItem('logged', 'false');
    }
  }
}

