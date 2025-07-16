import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { UserFilterPipe } from './user-filter.pipe';

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, UserFilterPipe],
  templateUrl: './admin-user-management.component.html',
})
export class AdminUserManagementComponent implements OnInit {
  users: any[] = [];
  filterRole: string = '';
  filterStatut: string = '';
  currentUser: any = null;
  showAddUser = false;
  newUser: any = { nom: '', prenom: '', email: '', telephone: '', matricule: '', password: '', unite_administrative: '', role: 'RESPONSABLE' };
  uniteOptions = [
    { id: 1, nom: "DIRECTION DU PATRIMOINE DE L ETAT" },
    { id: 2, nom: "PERSONNE RESPONSABLE DES MARCHES PUBLICS DGBF" },
    { id: 3, nom: "SERVICE DU PERSONNEL" },
    { id: 4, nom: "SERVICE DES STRUCTURES EXCENTRIQUES DU BUDGET" },
    { id: 5, nom: "SERVICE DE LA COMMUNICATION" },
    { id: 6, nom: "SERVICE DU CONTROLE INTERNE" },
    { id: 7, nom: "SECRETARIAT DGBF" },
    { id: 8, nom: "DIRECTION DE LA GESTION DES EFFECTIFS DES AGENTS DE L'ETAT" },
    { id: 9, nom: "SERVICE ADMINISTRATIF ET FINANCIER DGBF" },
    { id: 10, nom: "DIRECTION GENERALE DU BUDGET ET DES FINANCES" },
    { id: 11, nom: "CELLULE IPFP" },
    { id: 12, nom: "SERVICE DU PERSONNEL EXTERIEUR" },
    { id: 13, nom: "CELLULE EPN" },
    { id: 14, nom: "SERVICE D APPUI INSTITUTIONNEL" },
    { id: 15, nom: "SERVICE DE COORDINATION GENERALE DES ACTIVITES" },
    { id: 16, nom: "DIRECTION DE LA SOLDE ET DES PENSIONS" },
    { id: 17, nom: "DIRECTION DU BUDGET" },
    { id: 18, nom: "CELLULE D'APPUI STRATEGIQUE DGBF" },
    { id: 19, nom: "CIRFIN MORAMANGA" },
    { id: 20, nom: "CIRFIN MAROLAMBO" }
  ];

  ngOnInit() {
    // Vérifier que l'utilisateur courant est admin
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user || user.role !== 'ADMIN') {
      window.location.href = '/login';
      return;
    }
    this.currentUser = user;
    this.loadUsers();
  }

  loadUsers() {
    const all = JSON.parse(localStorage.getItem('users') || '[]');
    this.users = all;
  }

  validateUser(user: any) {
    user.statut = 'ACTIVE';
    this.saveUsers();
  }
  rejectUser(user: any) {
    user.statut = 'REJETE';
    this.saveUsers();
  }
  deleteUser(user: any) {
    if (user.role === 'ADMIN') return;
    this.users = this.users.filter(u => u !== user);
    this.saveUsers();
  }
  editUser(user: any) {
    // Pour simplifier, remplir le formulaire d'ajout avec les infos de l'utilisateur à modifier
    this.newUser = { ...user };
    this.showAddUser = true;
    this.deleteUser(user);
  }
  addUser() {
    // Vérifier unicité matricule/email
    if (this.users.some(u => u.matricule === this.newUser.matricule)) {
      alert('Matricule déjà utilisé');
      return;
    }
    if (this.users.some(u => u.email === this.newUser.email)) {
      alert('Email déjà utilisé');
      return;
    }
    this.newUser.statut = 'ACTIVE';
    this.users.push({ ...this.newUser });
    this.saveUsers();
    this.newUser = { nom: '', prenom: '', email: '', telephone: '', matricule: '', password: '', unite_administrative: '', role: 'RESPONSABLE' };
    this.showAddUser = false;
  }
  saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
    this.loadUsers();
  }

  // Méthodes pour filtrer, valider, rejeter, supprimer, ajouter, modifier à venir
} 