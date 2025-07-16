import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  menuOpen = false;
  userMenuOpen = false;
  user = {
    nom: 'Rakoto',
    prenom: 'Responsable',
    matricule: '123456',
    contact: '+261 34 12 345 67',
    mail: 'rakoto.responsable@email.com'
  };

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout() {
    // Logique de déconnexion ici (ex: redirection, suppression token, etc.)
    alert('Déconnexion');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Si le clic n'est pas sur le bouton ou le menu utilisateur, on ferme le menu
    if (!target.closest('.user-dropdown') && !target.closest('.user-avatar-btn')) {
      this.userMenuOpen = false;
    }
  }
} 