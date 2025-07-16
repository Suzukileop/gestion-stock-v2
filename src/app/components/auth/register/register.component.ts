import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  nom = '';
  prenom = '';
  email = '';
  telephone = '';
  matricule = '';
  password = '';
  confirmPassword = '';
  unite = '';
  errorMessage = '';
  successMessage = '';
  currentYear = new Date().getFullYear();
  showPassword = false;
  showConfirmPassword = false;
  showSuccessDialog = false;

  mockUnites = [
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
    // Créer un admin par défaut si aucun n'existe
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.some((u: any) => u.role === 'ADMIN')) {
      users.push({
        matricule: 'admin01',
        nom: 'Admin',
        prenom: 'Principal',
        email: 'admin@admin.com',
        telephone: '+261000000000',
        password: 'Admin@1234',
        unite_administrative: 'DIRECTION GENERALE DU BUDGET ET DES FINANCES',
        role: 'ADMIN',
        statut: 'ACTIVE'
      });
    }
    // Créer un responsable mock par défaut si aucun n'existe
    if (!users.some((u: any) => u.role === 'RESPONSABLE')) {
      users.push({
        matricule: 'resp01',
        nom: 'Rakoto',
        prenom: 'Responsable',
        email: 'responsable@minef.com',
        telephone: '+261340000001',
        password: 'Resp@1234',
        unite_administrative: 'DIRECTION DU PATRIMOINE DE L ETAT',
        role: 'RESPONSABLE',
        statut: 'ACTIVE'
      });
    }
    // Créer un client de test par défaut si aucun n'existe
    if (!users.some((u: any) => u.role === 'CLIENT')) {
      users.push({
        matricule: 'client01',
        nom: 'Rasoa',
        prenom: 'Client',
        email: 'client@minef.com',
        telephone: '+261340000002',
        password: 'Client@1234',
        unite_administrative: 'SERVICE DU PERSONNEL',
        role: 'CLIENT',
        statut: 'ACTIVE'
      });
    }
    localStorage.setItem('users', JSON.stringify(users));
  }

  onRegister() {
    // Vérification des champs obligatoires
    if (!this.nom || !this.prenom || !this.email || !this.telephone || !this.matricule || !this.password || !this.confirmPassword || !this.unite) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      this.successMessage = '';
      return;
    }
    // Matricule : 6 caractères
    if (this.matricule.length !== 6) {
      this.errorMessage = 'Le matricule doit contenir exactement 6 caractères.';
      this.successMessage = '';
      return;
    }
    // Email valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = "L'adresse email n'est pas valide.";
      this.successMessage = '';
      return;
    }
    // Mot de passe fort : majuscule, minuscule, chiffre, spécial, 8+ caractères
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(this.password)) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.';
      this.successMessage = '';
      return;
    }
    // Confirmation mot de passe
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      this.successMessage = '';
      return;
    }
    // Téléphone : 9 chiffres
    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(this.telephone)) {
      this.errorMessage = 'Le numéro de téléphone doit contenir exactement 9 chiffres.';
      this.successMessage = '';
      return;
    }
    // Préfixe +261 ajouté lors de l'envoi (simulation ici)
    const fullPhone = '+261' + this.telephone;
    // Vérifier unicité matricule/email
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u: any) => u.matricule === this.matricule)) {
      this.errorMessage = 'Ce matricule est déjà utilisé.';
      return;
    }
    if (users.some((u: any) => u.email === this.email)) {
      this.errorMessage = 'Cet email est déjà utilisé.';
      return;
    }
    // Créer le nouvel utilisateur (statut EN_ATTENTE_VALIDATION)
    const newUser = {
      matricule: this.matricule,
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      telephone: fullPhone,
      password: this.password,
      unite_administrative: this.mockUnites.find(u => String(u.id) === String(this.unite))?.nom || '',
      role: 'CLIENT',
      statut: 'EN_ATTENTE_VALIDATION'
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    // Succès et redirection
    this.errorMessage = '';
    this.successMessage = '';
    this.showSuccessDialog = true;
    localStorage.setItem('showConfirmationPage', '1');
    setTimeout(() => {
      this.showSuccessDialog = false;
      // Réinitialiser les champs
      this.nom = '';
      this.prenom = '';
      this.email = '';
      this.telephone = '';
      this.matricule = '';
      this.password = '';
      this.confirmPassword = '';
      this.unite = '';
      // Redirection vers la page de confirmation
      window.location.href = '/confirmation-inscription';
    }, 3500);
  }
} 