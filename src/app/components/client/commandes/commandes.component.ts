import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarClientComponent } from '../sidebar-client/sidebar-client.component';
import { CATEGORIES, ARTICLES_PAR_CATEGORIE, UNITE_PAR_ARTICLE } from '../../../data/articles-data';

@Component({
  selector: 'app-commandes-client',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarClientComponent, FormsModule],
  templateUrl: './commandes.component.html',
})
export class CommandesClientComponent implements OnInit {
  commandesEnCours = 0;
  commandesLivrees = 0;
  dernieresCommandes: any[] = [];
  showCommandeModal = false;
  stepCommande: 1 | 2 = 1;
  commandeForm = { categorie: '', article: '', unite: '', quantite: '' };
  commandeMeta = { compte: '', motif: '' };
  commandeErrors = { categorie: false, article: false, unite: false, quantite: false };
  metaErrors = { compte: false, motif: false };
  articlesCommande: any[] = [];
  comptes = ['DSP', 'DGBF'];
  categories = CATEGORIES;
  articleOptions: string[] = [];
  selectedArticle: string = '';
  selectedUnite: string = '';
  message: string | null = null;
  messageType: 'success' | 'error' | 'warning' | null = null;
  selectedCommande: any = null;
  searchTerm: string = '';
  filterDateStart: string | null = null;
  filterDateEnd: string | null = null;
  filterStatut: string = '';
  showDateRange: boolean = false;
  viewMode: 'table' | 'cards' = 'table';
  filteredCommandes: any[] = [];
  editIndex: number | null = null;
  editAnimation: boolean = false;
  showActionsMenuCmdId: number | null = null;
  isEditMode: boolean = false;
  editedCommandeId: number | null = null;
  showToast: boolean = false;
  pageSize: number = 10;
  currentPage: number = 1;
  totalItems: number = 0;
  totalPages: number = 1;
  filteredCommandesAll: any[] = [];

  ngOnInit() {
    this.chargerDonnees();
    this.onFilterChange();
    if (this.commandeForm.categorie) {
      this.onCategorieChange();
    }
    window.addEventListener('storage', (event) => {
      if (event.key === 'commandes') {
        this.chargerDonnees();
      }
    });
  }

  chargerDonnees() {
    const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
    const clientConnecte = JSON.parse(localStorage.getItem('user_connecte') || '{}');
    const commandesClient = commandes.filter((cmd: any) => cmd.client_id === clientConnecte.id);
    commandesClient.forEach((cmd: any) => cmd.showDetail = false);
    this.commandesEnCours = commandesClient.filter((cmd: any) => ['ENVOYEE', 'VALIDEE'].includes(cmd.statut)).length;
    this.commandesLivrees = commandesClient.filter((cmd: any) => cmd.statut === 'LIVREE').length;
    this.dernieresCommandes = commandesClient.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.onFilterChange();
  }

  nouvelleCommande() { this.ouvrirCommandeModal(); }
  ouvrirCommandeModal() { this.showCommandeModal = true; this.stepCommande = 1; this.resetCommandeForm(); }
  closeCommandeModal() {
    this.showCommandeModal = false;
    this.stepCommande = 1;
    this.resetCommandeForm();
    this.isEditMode = false;
    this.editedCommandeId = null;
  }
  resetCommandeForm() {
    this.commandeForm = { categorie: '', article: '', unite: '', quantite: '' };
    this.commandeMeta = { compte: '', motif: '' };
    this.commandeErrors = { categorie: false, article: false, unite: false, quantite: false };
    this.metaErrors = { compte: false, motif: false };
    this.articlesCommande = [];
    this.message = null;
    this.messageType = null;
    this.selectedArticle = '';
    this.selectedUnite = '';
    this.editIndex = null;
    this.editAnimation = false;
  }
  ajouterArticle() {
    let valid = true;
    this.commandeErrors = { categorie: false, article: false, unite: false, quantite: false };
    const quantiteNum = parseInt(this.commandeForm.quantite as any, 10);
    if (!this.commandeForm.categorie) { this.commandeErrors.categorie = true; valid = false; }
    if (!this.selectedArticle) { this.commandeErrors.article = true; valid = false; }
    if (!this.selectedUnite) { this.commandeErrors.unite = true; valid = false; }
    if (!quantiteNum || quantiteNum <= 0) { this.commandeErrors.quantite = true; valid = false; }
    if (!valid) return;
    this.articlesCommande.push({
      article: this.selectedArticle,
      unite: this.selectedUnite,
      quantite: quantiteNum,
      categorie: this.commandeForm.categorie
    });
    this.selectedArticle = '';
    this.selectedUnite = '';
    this.commandeForm.article = '';
    this.commandeForm.unite = '';
    this.commandeForm.quantite = '';
  }
  supprimerArticle(index: number) { this.articlesCommande.splice(index, 1); }
  passerEtape2() {
    if (this.articlesCommande.length === 0) {
      this.message = "Ajoutez au moins un article avant de continuer.";
      this.messageType = 'error';
      this.clearMessageAfterDelay();
      return;
    }
    this.stepCommande = 2;
  }
  validerCommande() {
    let valid = true;
    this.metaErrors = { compte: false, motif: false };
    if (!this.commandeMeta.compte) { this.metaErrors.compte = true; valid = false; }
    if (!this.commandeMeta.motif) { this.metaErrors.motif = true; valid = false; }
    if (!valid) return;
    const clientConnecte = JSON.parse(localStorage.getItem('user_connecte') || '{}');
    const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
    if (this.isEditMode && this.editedCommandeId !== null) {
      // Vérifier si modification réelle
      const idx = commandes.findIndex((c: any) => c.id === this.editedCommandeId);
      if (idx !== -1) {
        const oldCmd = commandes[idx];
        const sameArticles = JSON.stringify(oldCmd.articles) === JSON.stringify(this.articlesCommande);
        const sameCompte = oldCmd.compte === this.commandeMeta.compte;
        const sameMotif = oldCmd.motif === this.commandeMeta.motif;
        const sameCategorie = oldCmd.categorie === (this.articlesCommande[0]?.categorie || '');
        if (sameArticles && sameCompte && sameMotif && sameCategorie) {
          this.closeCommandeModal();
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
        commandes[idx] = {
          ...commandes[idx],
          articles: [...this.articlesCommande],
          nombreArticles: this.articlesCommande.length,
          compte: this.commandeMeta.compte,
          motif: this.commandeMeta.motif,
          categorie: this.articlesCommande[0]?.categorie || '',
          motifRetour: oldCmd.motifRetour ?? null,
        };
        localStorage.setItem('commandes', JSON.stringify(commandes));
        this.chargerDonnees();
        this.closeCommandeModal();
        setTimeout(() => {
          this.message = "Commande mise à jour avec succès !";
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
    let dernierNumero = parseInt(localStorage.getItem('dernier_numero_commande') || '0', 10);
    dernierNumero++;
    localStorage.setItem('dernier_numero_commande', dernierNumero.toString());
    const nouvelleCommande = {
      id: Date.now(),
      numero: dernierNumero.toString(),
      client_id: clientConnecte.id,
      date: new Date().toISOString(),
      statut: 'BROUILLON',
      articles: [...this.articlesCommande],
      nombreArticles: this.articlesCommande.length,
      compte: this.commandeMeta.compte,
      motif: this.commandeMeta.motif,
      categorie: this.articlesCommande[0]?.categorie || '',
      motifRetour: null,
      showDetail: false
    };
    commandes.push(nouvelleCommande);
    localStorage.setItem('commandes', JSON.stringify(commandes));
    this.chargerDonnees();
    this.closeCommandeModal();
    setTimeout(() => {
      this.message = "Commande créée avec succès !";
      this.messageType = 'success';
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
        setTimeout(() => { this.message = null; this.messageType = null; }, 500);
      }, 1500);
    }, 250);
  }
  clearMessageAfterDelay() { setTimeout(() => { this.message = null; this.messageType = null; }, 2500); }
  toggleDetailCommande(cmd: any) { this.dernieresCommandes.forEach(c => { if (c !== cmd) c.showDetail = false; }); cmd.showDetail = !cmd.showDetail; }
  openDetailModal(cmd: any) { this.selectedCommande = cmd; }
  closeDetailModal() { this.selectedCommande = null; }

  onFilterChange() {
    const commandesClient = this.dernieresCommandes.filter(cmd => {
      // Recherche texte (sur numéro, compte, motif, etc.)
      const search = this.searchTerm.trim().toLowerCase();
      const matchSearch = !search ||
        cmd.numero?.toLowerCase().includes(search) ||
        cmd.compte?.toLowerCase().includes(search) ||
        cmd.motif?.toLowerCase().includes(search);
      // Statut
      const matchStatut = !this.filterStatut || cmd.statut === this.filterStatut;
      // Date
      const dateCmd = new Date(cmd.date);
      let matchDate = true;
      if (this.filterDateStart) matchDate = matchDate && (dateCmd >= new Date(this.filterDateStart));
      if (this.filterDateEnd) matchDate = matchDate && (dateCmd <= new Date(this.filterDateEnd));
      return matchSearch && matchStatut && matchDate;
    });
    this.filteredCommandesAll = commandesClient;
    this.currentPage = 1;
    this.updatePagination();
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
      const first = new Date(today);
      first.setDate(today.getDate() - today.getDay());
      this.filterDateStart = first.toISOString().slice(0, 10);
      this.filterDateEnd = today.toISOString().slice(0, 10);
    } else if (range === 'month') {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      this.filterDateStart = first.toISOString().slice(0, 10);
      this.filterDateEnd = today.toISOString().slice(0, 10);
    } else if (range === '30days') {
      const first = new Date(today);
      first.setDate(today.getDate() - 29);
      this.filterDateStart = first.toISOString().slice(0, 10);
      this.filterDateEnd = today.toISOString().slice(0, 10);
    }
    this.onFilterChange();
  }

  onCategorieChange() {
    this.articleOptions = ARTICLES_PAR_CATEGORIE[this.commandeForm.categorie] || [];
    this.selectedArticle = '';
    this.selectedUnite = '';
    this.commandeForm.article = '';
    this.commandeForm.unite = '';
  }

  onArticleChange() {
    this.selectedUnite = UNITE_PAR_ARTICLE[this.selectedArticle] || '';
    this.commandeForm.article = this.selectedArticle;
    this.commandeForm.unite = this.selectedUnite;
  }

  editArticle(i: number) {
    const art = this.articlesCommande[i];
    this.selectedArticle = art.article;
    this.selectedUnite = art.unite;
    this.commandeForm.quantite = art.quantite;
    this.editIndex = i;
    this.editAnimation = true;
    setTimeout(() => { this.editAnimation = false; }, 400);
  }

  updateArticle() {
    if (this.editIndex !== null && this.editIndex !== undefined) {
      this.articlesCommande[this.editIndex] = {
        article: this.selectedArticle,
        unite: this.selectedUnite,
        quantite: this.commandeForm.quantite,
        categorie: this.commandeForm.categorie
      };
      this.selectedArticle = '';
      this.selectedUnite = '';
      this.commandeForm.article = '';
      this.commandeForm.unite = '';
      this.commandeForm.quantite = '';
      this.editIndex = null;
    }
  }

  openActionsMenu(cmd: any, event: MouseEvent) {
    event.stopPropagation();
    this.dernieresCommandes.forEach(c => c.showActionsMenu = false);
    cmd.showActionsMenu = true;
    this.showActionsMenuCmdId = cmd.id;
    setTimeout(() => {
      window.addEventListener('click', this.closeActionsMenuOnClickOutside, { once: true });
    });
  }

  closeActionsMenuOnClickOutside = (event: MouseEvent) => {
    this.dernieresCommandes.forEach(c => c.showActionsMenu = false);
    this.showActionsMenuCmdId = null;
  };

  onEditCommande(cmd: any) {
    this.isEditMode = true;
    this.editedCommandeId = cmd.id;
    this.showCommandeModal = true;
    this.stepCommande = 1;
    // Pré-remplir le formulaire et le panier
    this.commandeForm = { categorie: cmd.categorie, article: '', unite: '', quantite: '' };
    this.commandeMeta = { compte: cmd.compte, motif: cmd.motif };
    this.articlesCommande = cmd.articles.map((a: any) => ({ ...a }));
    this.articleOptions = ARTICLES_PAR_CATEGORIE[cmd.categorie] || [];
    this.selectedArticle = '';
    this.selectedUnite = '';
    this.commandeErrors = { categorie: false, article: false, unite: false, quantite: false };
    this.metaErrors = { compte: false, motif: false };
    this.message = null;
    this.messageType = null;
    this.editIndex = null;
    this.editAnimation = false;
    this.closeActionsMenuOnClickOutside(new MouseEvent('click'));
  }

  onDeleteCommande(cmd: any) {
    if (confirm('Voulez-vous vraiment supprimer cette commande ?')) {
      const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
      const updated = commandes.filter((c: any) => c.id !== cmd.id);
      localStorage.setItem('commandes', JSON.stringify(updated));
      this.chargerDonnees();
      this.closeActionsMenuOnClickOutside(new MouseEvent('click'));
      setTimeout(() => {
        this.message = "Commande supprimée avec succès.";
        this.messageType = 'error';
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
          setTimeout(() => { this.message = null; this.messageType = null; }, 500);
        }, 2000);
      }, 150);
    }
  }

  closeToast() {
    this.showToast = false;
    setTimeout(() => { this.message = null; this.messageType = null; }, 500);
  }

  get darkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  soumettreCommande(cmd: any) {
    const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
    const idx = commandes.findIndex((c: any) => c.id === cmd.id);
    if (idx !== -1) {
      commandes[idx].statut = 'ENVOYEE';
      localStorage.setItem('commandes', JSON.stringify(commandes));
      this.chargerDonnees();
      this.message = "Commande soumise : en cours de traitement.";
      this.messageType = 'success';
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
        setTimeout(() => { this.message = null; this.messageType = null; }, 500);
      }, 2000);
    }
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  updatePagination() {
    this.totalItems = this.filteredCommandesAll.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    // Découper la page courante
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredCommandes = this.filteredCommandesAll.slice(start, end);
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  max(a: number, b: number): number {
    return Math.max(a, b);
  }
} 