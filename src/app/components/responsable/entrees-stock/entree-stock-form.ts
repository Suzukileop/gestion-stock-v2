import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CATEGORIES, ARTICLES_PAR_CATEGORIE, UNITE_PAR_ARTICLE } from '../../../data/articles-data';

@Component({
  selector: 'entree-stock-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entree-stock-form.html',
})
export class EntreeStockFormComponent {
  entree: any = {
    numero_piece: '',
    date_entree: '',
    marchandise: '',
    statut: 'BROUILLON',
    lignes: []
  };
  categories = CATEGORIES;
  articlesParCategorie = ARTICLES_PAR_CATEGORIE;
  uniteParArticle = UNITE_PAR_ARTICLE;

  selectedCategorie: string = '';
  selectedArticle: string = '';
  selectedUnite: string = '';

  ligne: any = { categorie: '', article: '', unite: '', quantite: 1, prix_unitaire: 0, magasin: '', etagere: '' };
  lignes: any[] = [];

  showError = false;

  fileError: string = '';
  justificatifFile: File | null = null;

  constructor(private router: Router) {}

  onCategorieChange() {
    this.selectedArticle = '';
    this.selectedUnite = '';
    this.ligne.article = '';
    this.ligne.unite = '';
  }

  onArticleChange() {
    this.selectedUnite = this.uniteParArticle[this.selectedArticle] || '';
    this.ligne.unite = this.selectedUnite;
  }

  addLigne() {
    if (!this.selectedCategorie || !this.selectedArticle || !this.ligne.quantite || this.ligne.quantite <= 0) {
      this.showError = true;
      return;
    }
    this.showError = false;
    this.lignes.push({
      categorie: this.selectedCategorie,
      article: this.selectedArticle,
      unite: this.selectedUnite,
      quantite: this.ligne.quantite,
      prix_unitaire: this.ligne.prix_unitaire,
      magasin: this.ligne.magasin,
      etagere: this.ligne.etagere
    });
    this.selectedCategorie = '';
    this.selectedArticle = '';
    this.selectedUnite = '';
    this.ligne = { categorie: '', article: '', unite: '', quantite: 1, prix_unitaire: 0, magasin: '', etagere: '' };
  }

  removeLigne(i: number) {
    this.lignes.splice(i, 1);
  }

  save() {
    this.entree.lignes = this.lignes;
    const entrees = JSON.parse(localStorage.getItem('entreesStock') || '[]');
    this.entree.id = crypto.randomUUID();
    this.entree.date_entree = this.entree.date_entree || new Date().toISOString();
    entrees.push(this.entree);
    localStorage.setItem('entreesStock', JSON.stringify(entrees));
    this.router.navigate(['/responsable/entrees-stock']);
  }

  resetForm() {
    this.entree = {
      numero_piece: '',
      date_entree: '',
      marchandise: '',
      statut: 'BROUILLON',
      lignes: [],
      telephone: ''
    };
    this.selectedCategorie = '';
    this.selectedArticle = '';
    this.selectedUnite = '';
    this.ligne = { categorie: '', article: '', unite: '', quantite: 1, prix_unitaire: 0, magasin: '', etagere: '' };
    this.lignes = [];
    this.fileError = '';
    this.justificatifFile = null;
    this.showError = false;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) {
      this.fileError = 'Aucun fichier sélectionné.';
      this.justificatifFile = null;
      return;
    }
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.fileError = 'Format de fichier non supporté.';
      this.justificatifFile = null;
      return;
    }
    // Optionnel : vérifier la taille ou les dimensions ici
    this.fileError = '';
    this.justificatifFile = file;
  }
}
