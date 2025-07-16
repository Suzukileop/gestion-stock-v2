import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.css']
})
export class LoginComponent {
  matriculeOrEmail = '';
  password = '';
  errorMessage = '';
  currentYear = new Date().getFullYear();
  showPassword = false;

  // Mock user data for demonstration
  mockUser = {
    matricule: '12345',
    email: 'test@example.com',
    password: 'password123'
  };

  constructor() { }

  onLogin() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) =>
      (u.matricule === this.matriculeOrEmail || u.email === this.matriculeOrEmail)
    );
    if (!user) {
      this.errorMessage = 'Matricule/email ou mot de passe incorrect.';
      return;
    }
    if (user.password !== this.password) {
      this.errorMessage = 'Matricule/email ou mot de passe incorrect.';
      return;
    }
    if (user.statut === 'EN_ATTENTE_VALIDATION') {
      this.errorMessage = 'Votre compte est en attente de validation par un administrateur.';
      return;
    }
    if (user.statut !== 'ACTIVE') {
      this.errorMessage = 'Votre compte n\'est pas actif.';
      return;
    }
    // Connexion réussie : stocker l'utilisateur courant
      this.errorMessage = '';
    localStorage.setItem('currentUser', JSON.stringify(user));
    // Redirection selon le rôle
    if (user.role === 'ADMIN') {
      window.location.href = '/admin/users';
    } else if (user.role === 'RESPONSABLE') {
      window.location.href = '/responsable/dashboard';
    } else if (user.role === 'CLIENT') {
      window.location.href = '/client/dashboard';
    } else {
      window.location.href = '/login';
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    // TODO: Rediriger vers la page de login
  }
} 