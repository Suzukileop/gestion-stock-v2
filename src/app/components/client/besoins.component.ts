import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarClientComponent } from './sidebar-client/sidebar-client.component';
import { CATEGORIES, ARTICLES_PAR_CATEGORIE, UNITE_PAR_ARTICLE } from '../../data/articles-data';

@Component({
  selector: 'app-besoins-client',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarClientComponent, FormsModule],
  templateUrl: './besoins.component.html',
  styleUrls: ['./besoins.component.css']
})
export class BesoinsClientComponent implements OnInit {
  besoinsEnCours = 0;
  besoinsValides = 0;
  derniersBesoins: any[] = [];
  showBesoinModal = false;
  stepBesoin: 1 | 2 = 1;
  besoinForm = { categorie: '', article: '', unite: '', quantite: '' };
  besoinMeta = { compte: '', motif: '', dateDebut: '', dateFin: '' };
  besoinErrors = { categorie: false, article: false, unite: false, quantite: false };
  metaErrors = { compte: false, motif: false, dateDebut: false, dateFin: false };
  articlesBesoin: any[] = [];
  comptes = ['DSP', 'DGBF'];
  categories = CATEGORIES;
  articleOptions: string[] = [];
  selectedArticle: string = '';
  selectedUnite: string = '';
  message: string | null = null;
  messageType: 'success' | 'error' | 'warning' | null = null;
  selectedBesoin: any = null;
  searchTerm: string = '';
  filterDateStart: string | null = null;
  filterDateEnd: string | null = null;
  filterStatut: string = '';
  showDateRange: boolean = false;
  viewMode: 'table' | 'cards' = 'table';
  filteredBesoins: any[] = [];
  editIndex: number | null = null;
  editAnimation: boolean = false;
  showActionsMenuBesoinId: number | null = null;
  isEditMode: boolean = false;
  editedBesoinId: number | null = null;
  showToast: boolean = false;

  ngOnInit() {
    this.chargerDonnees();
    this.onFilterChange();
    if (this.besoinForm.categorie) {
      this.onCategorieChange();
    }
  }

  chargerDonnees() {
    const besoins = JSON.parse(localStorage.getItem('besoins') || '[]');
    const clientConnecte = JSON.parse(localStorage.getItem('user_connecte') || '{}');
    const besoinsClient = besoins.filter((b: any) => b.client_id === clientConnecte.id);
    besoinsClient.forEach((b: any) => b.showDetail = false);
    this.besoinsEnCours = besoinsClient.filter((b: any) => ['ENVOYEE', 'VALIDEE'].includes(b.statut)).length;
    this.besoinsValides = besoinsClient.filter((b: any) => b.statut === 'VALIDEE').length;
    this.derniersBesoins = besoinsClient.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.onFilterChange();
  }

  nouveauBesoin() { this.ouvrirBesoinModal(); }
  ouvrirBesoinModal() { this.showBesoinModal = true; this.stepBesoin = 1; this.resetBesoinForm(); }
  closeBesoinModal() {
    this.showBesoinModal = false;
    this.stepBesoin = 1;
    this.resetBesoinForm();
    this.isEditMode = false;
    this.editedBesoinId = null;
  }
  resetBesoinForm() {
    this.besoinForm = { categorie: '', article: '', unite: '', quantite: '' };
    this.besoinMeta = { compte: '', motif: '', dateDebut: '', dateFin: '' };
    this.besoinErrors = { categorie: false, article: false, unite: false, quantite: false };
    this.metaErrors = { compte: false, motif: false, dateDebut: false, dateFin: false };
    this.articlesBesoin = [];
    this.message = null;
    this.messageType = null;
    this.selectedArticle = '';
    this.selectedUnite = '';
    this.editIndex = null;
    this.editAnimation = false;
  }
  ajouterArticle() {
    let valid = true;
    this.besoinErrors = { categorie: false, article: false, unite: false, quantite: false };
    const quantiteNum = parseInt(this.besoinForm.quantite as any, 10);
    if (!this.besoinForm.categorie) { this.besoinErrors.categorie = true; valid = false; }
    if (!this.selectedArticle) { this.besoinErrors.article = true; valid = false; }
    if (!this.selectedUnite) { this.besoinErrors.unite = true; valid = false; }
    if (!quantiteNum || quantiteNum <= 0) { this.besoinErrors.quantite = true; valid = false; }
    if (!valid) return;
    this.articlesBesoin.push({
      article: this.selectedArticle,
      unite: this.selectedUnite,
      quantite: quantiteNum,
      categorie: this.besoinForm.categorie
    });
    this.selectedArticle = '';
    this.selectedUnite = '';
    this.besoinForm.article = '';
    this.besoinForm.unite = '';
    this.besoinForm.quantite = '';
  }
  supprimerArticle(index: number) { this.articlesBesoin.splice(index, 1); }
  passerEtape2() {
    if (this.articlesBesoin.length === 0) {
      this.message = "Ajoutez au moins un article avant de continuer.";
      this.messageType = 'error';
      this.clearMessageAfterDelay();
      return;
    }
    this.stepBesoin = 2;
  }
  validerBesoin() {
    let valid = true;
    this.metaErrors = { compte: false, motif: false, dateDebut: false, dateFin: false };
    if (!this.besoinMeta.compte) { this.metaErrors.compte = true; valid = false; }
    if (!this.besoinMeta.motif) { this.metaErrors.motif = true; valid = false; }
    if (!this.besoinMeta.dateDebut) { this.metaErrors.dateDebut = true; valid = false; }
    if (!this.besoinMeta.dateFin) { this.metaErrors.dateFin = true; valid = false; }
    if (!valid) return;
    const clientConnecte = JSON.parse(localStorage.getItem('user_connecte') || '{}');
    const besoins = JSON.parse(localStorage.getItem('besoins') || '[]');
    if (this.isEditMode && this.editedBesoinId !== null) {
      // Vérifier si modification réelle
      const idx = besoins.findIndex((b: any) => b.id === this.editedBesoinId);
      if (idx !== -1) {
        const oldBsn = besoins[idx];
        const sameArticles = JSON.stringify(oldBsn.articles) === JSON.stringify(this.articlesBesoin);
        const sameCompte = oldBsn.compte === this.besoinMeta.compte;
        const sameMotif = oldBsn.motif === this.besoinMeta.motif;
        const sameCategorie = oldBsn.categorie === (this.articlesBesoin[0]?.categorie || '');
        const sameDateDebut = oldBsn.dateDebut === this.besoinMeta.dateDebut;
        const sameDateFin = oldBsn.dateFin === this.besoinMeta.dateFin;
        if (sameArticles && sameCompte && sameMotif && sameCategorie && sameDateDebut && sameDateFin) {
          this.closeBesoinModal();
          setTimeout(() => {
            this.message = "Aucune modification apportée.";
            this.messageType = 'warning';
            this.showToast = true;
            setTimeout(() => {
              this.showToast = false;
              setTimeout(() => { this.message = null; this.messageType = null; }, 500);
            }, 3000);
          }, 250);
          return;
        }
        // Mise à jour réelle
        besoins[idx] = {
          ...besoins[idx],
          articles: [...this.articlesBesoin],
          nombreArticles: this.articlesBesoin.length,
          compte: this.besoinMeta.compte,
          motif: this.besoinMeta.motif,
          categorie: this.articlesBesoin[0]?.categorie || '',
          dateDebut: this.besoinMeta.dateDebut,
          dateFin: this.besoinMeta.dateFin,
          motifRetour: oldBsn.motifRetour ?? null,
        };
        localStorage.setItem('besoins', JSON.stringify(besoins));
        this.chargerDonnees();
        this.closeBesoinModal();
        setTimeout(() => {
          this.message = "Besoin mis à jour avec succès !";
          this.messageType = 'success';
          this.showToast = true;
          setTimeout(() => {
            this.showToast = false;
            setTimeout(() => { this.message = null; this.messageType = null; }, 500);
          }, 1500);
        }, 250);
        return;
      }
    }
    // Création normale
    let dernierNumero = parseInt(localStorage.getItem('dernier_numero_besoin') || '0', 10);
    dernierNumero++;
    localStorage.setItem('dernier_numero_besoin', dernierNumero.toString());
    const nouveauBesoin = {
      id: Date.now(),
      numero: dernierNumero.toString(),
      client_id: clientConnecte.id,
      date: new Date().toISOString(),
      statut: 'BROUILLON',
      articles: [...this.articlesBesoin],
      nombreArticles: this.articlesBesoin.length,
      compte: this.besoinMeta.compte,
      motif: this.besoinMeta.motif,
      categorie: this.articlesBesoin[0]?.categorie || '',
      dateDebut: this.besoinMeta.dateDebut,
      dateFin: this.besoinMeta.dateFin,
      motifRetour: null,
      showDetail: false
    };
    besoins.push(nouveauBesoin);
    localStorage.setItem('besoins', JSON.stringify(besoins));
    this.chargerDonnees();
    this.closeBesoinModal();
    setTimeout(() => {
      this.message = "Besoin créé avec succès !";
      this.messageType = 'success';
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
        setTimeout(() => { this.message = null; this.messageType = null; }, 500);
      }, 1500);
    }, 250);
  }
  clearMessageAfterDelay() { setTimeout(() => { this.message = null; this.messageType = null; }, 2500); }
  toggleDetailBesoin(bsn: any) { this.derniersBesoins.forEach(b => { if (b !== bsn) b.showDetail = false; }); bsn.showDetail = !bsn.showDetail; }
  openDetailModal(bsn: any) { this.selectedBesoin = bsn; }
  closeDetailModal() { this.selectedBesoin = null; }

  onFilterChange() {
    this.filteredBesoins = this.derniersBesoins.filter(bsn => {
      // Recherche texte (sur numéro, compte, motif, etc.)
      const search = this.searchTerm.trim().toLowerCase();
      const matchSearch = !search ||
        bsn.numero?.toLowerCase().includes(search) ||
        bsn.compte?.toLowerCase().includes(search) ||
        bsn.motif?.toLowerCase().includes(search);
      // Statut
      const matchStatut = !this.filterStatut || bsn.statut === this.filterStatut;
      // Date
      const dateBsn = new Date(bsn.date);
      let matchDate = true;
      if (this.filterDateStart) matchDate = matchDate && (dateBsn >= new Date(this.filterDateStart));
      if (this.filterDateEnd) matchDate = matchDate && (dateBsn <= new Date(this.filterDateEnd));
      return matchSearch && matchStatut && matchDate;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.filterDateStart = null;
    this.filterDateEnd = null;
    this.filterStatut = '';
    this.onFilterChange();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
  }

  onDateStartChange() { this.onFilterChange(); }
  onDateEndChange() { this.onFilterChange(); }

  setQuickRange(range: string) {
    const today = new Date();
    if (range === 'today') {
      const d = today.toISOString().slice(0, 10);
      this.filterDateStart = d;
      this.filterDateEnd = d;
    } else if (range === 'week') {
      const first = today.getDate() - today.getDay();
      const last = first + 6;
      const firstDay = new Date(today.setDate(first));
      const lastDay = new Date(today.setDate(last));
      this.filterDateStart = firstDay.toISOString().slice(0, 10);
      this.filterDateEnd = lastDay.toISOString().slice(0, 10);
    } else if (range === 'month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      this.filterDateStart = firstDay.toISOString().slice(0, 10);
      this.filterDateEnd = lastDay.toISOString().slice(0, 10);
    } else if (range === '30days') {
      const firstDay = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
      this.filterDateStart = firstDay.toISOString().slice(0, 10);
      this.filterDateEnd = today.toISOString().slice(0, 10);
    }
    this.onFilterChange();
  }

  onCategorieChange() {
    if (!this.besoinForm.categorie) {
      this.articleOptions = [];
      this.selectedArticle = '';
      this.selectedUnite = '';
      return;
    }
    this.articleOptions = ARTICLES_PAR_CATEGORIE[this.besoinForm.categorie] || [];
    this.selectedArticle = '';
    this.selectedUnite = '';
  }

  onArticleChange() {
    if (!this.selectedArticle) {
      this.selectedUnite = '';
      return;
    }
    this.selectedUnite = UNITE_PAR_ARTICLE[this.selectedArticle] || '';
  }

  editArticle(i: number) {
    const art = this.articlesBesoin[i];
    this.besoinForm.categorie = art.categorie;
    this.selectedArticle = art.article;
    this.selectedUnite = art.unite;
    this.besoinForm.article = art.article;
    this.besoinForm.unite = art.unite;
    this.besoinForm.quantite = art.quantite;
    this.editIndex = i;
    this.editAnimation = true;
    setTimeout(() => { this.editAnimation = false; }, 600);
  }

  updateArticle() {
    if (this.editIndex === null || this.editIndex === undefined) return;
    let valid = true;
    this.besoinErrors = { categorie: false, article: false, unite: false, quantite: false };
    const quantiteNum = parseInt(this.besoinForm.quantite as any, 10);
    if (!this.besoinForm.categorie) { this.besoinErrors.categorie = true; valid = false; }
    if (!this.selectedArticle) { this.besoinErrors.article = true; valid = false; }
    if (!this.selectedUnite) { this.besoinErrors.unite = true; valid = false; }
    if (!quantiteNum || quantiteNum <= 0) { this.besoinErrors.quantite = true; valid = false; }
    if (!valid) return;
    this.articlesBesoin[this.editIndex] = {
      article: this.selectedArticle,
      unite: this.selectedUnite,
      quantite: quantiteNum,
      categorie: this.besoinForm.categorie
    };
    this.editIndex = null;
    this.selectedArticle = '';
    this.selectedUnite = '';
    this.besoinForm.article = '';
    this.besoinForm.unite = '';
    this.besoinForm.quantite = '';
  }

  onEditBesoin(bsn: any) {
    this.isEditMode = true;
    this.editedBesoinId = bsn.id;
    this.articlesBesoin = [...bsn.articles];
    this.besoinMeta = { compte: bsn.compte, motif: bsn.motif, dateDebut: bsn.dateDebut, dateFin: bsn.dateFin };
    this.besoinForm.categorie = bsn.categorie;
    this.selectedArticle = '';
    this.selectedUnite = '';
    this.showBesoinModal = true;
    this.stepBesoin = 1;
  }

  onDeleteBesoin(bsn: any) {
    const besoins = JSON.parse(localStorage.getItem('besoins') || '[]');
    const idx = besoins.findIndex((b: any) => b.id === bsn.id);
    if (idx !== -1) {
      besoins.splice(idx, 1);
      localStorage.setItem('besoins', JSON.stringify(besoins));
      this.chargerDonnees();
      this.message = "Besoin supprimé avec succès !";
      this.messageType = 'error';
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
        setTimeout(() => { this.message = null; this.messageType = null; }, 500);
      }, 2000);
    }
  }

  soumettreBesoin(bsn: any) {
    const besoins = JSON.parse(localStorage.getItem('besoins') || '[]');
    const idx = besoins.findIndex((b: any) => b.id === bsn.id);
    if (idx !== -1) {
      besoins[idx].statut = 'ENVOYEE';
      localStorage.setItem('besoins', JSON.stringify(besoins));
      this.chargerDonnees();
      this.message = "Besoin soumis : en cours de traitement.";
      this.messageType = 'success';
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
        setTimeout(() => { this.message = null; this.messageType = null; }, 500);
      }, 2000);
    }
  }

  closeToast() {
    this.showToast = false;
    setTimeout(() => { this.message = null; this.messageType = null; }, 500);
  }

  get darkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }
} 