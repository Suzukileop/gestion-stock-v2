import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarResponsableComponent } from '../sidebar-responsable.component';
import { EntreeStockService } from '../../../services/entree-stock.service';
import { ARTICLES_PAR_CATEGORIE, UNITE_PAR_ARTICLE, CATEGORIES } from '../../../data/articles-data';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'entrees-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarResponsableComponent, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './entrees-stock.html',
  styleUrls: ['./entrees-stock.css']
})
export class EntreesStockComponent implements OnInit {
  pieces: any[] = [];
  selectedPiece: any | null = null;
  showCreateModal: boolean = false;
  newPiece: any = this.getEmptyPiece();
  newLigne: any = this.getEmptyLigne();

  searchTerm: string = '';
  filterStatut: string = '';
  filterMarchandise: string = '';
  filterDateStart: string = '';
  filterDateEnd: string = '';
  currentPage: number = 1;
  pageSize: number = 9;

  viewMode: 'cards' | 'table' = 'cards';

  showArticleModal: boolean = false;
  currentPiece: any = null;
  articleFormData: any = { designation: '', unite: '', prix_unitaire: '', quantite: '', date_peremption: '' };
  editMode: boolean = false;
  editIndex: number = -1;

  localArticleList: any[] = [];

  articleOptions: string[] = [];
  selectedArticle: string = '';
  selectedUnite: string = '';

  articleFormSubmitted: boolean = false;

  showCreateError: boolean = false;
  fileCreateError: string = '';

  showDateRange: boolean = false;

  @ViewChild('dateRangeDropdown') dateRangeDropdown!: ElementRef;

  showUpdateModal: boolean = false;
  updatePiece: any = null;

  messageToast: string = '';

  displayedColumns: string[] = ['numero_piece', 'date_piece', 'marche', 'categorie_article', 'compte', 'statut', 'expand'];
  expandedPiece: any | null = null;

  @ViewChild('articleFormTop') articleFormTop!: ElementRef;

  constructor(private entreeStockService: EntreeStockService) {}

  ngOnInit() {
    this.pieces = this.entreeStockService.getAll();
  }

  deletePiece(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      return;
    }
    this.entreeStockService.delete(id);
    this.pieces = this.entreeStockService.getAll();
    this.selectedPiece = null;
    this.messageToast = 'Entrée supprimée avec succès !';
    setTimeout(() => { this.messageToast = ''; }, 2500);
  }

  openDetail(piece: any) {
    if (this.selectedPiece && this.selectedPiece.id === piece.id) {
      this.selectedPiece = null;
    } else {
    this.selectedPiece = piece;
    }
  }

  closeDetail() {
    this.selectedPiece = null;
  }

  openCreateModal() {
    this.resetCreateForm();
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.resetCreateForm();
  }

  getEmptyPiece() {
    return {
      numero_piece: '',
      date_piece: '',
      marche: '',
      categorie_article: '',
      compte: '',
      contact: '',
      tous_livres: '',
      commentaire: '',
      piece_justificative: null,
      statut: 'BROUILLON',
      articles: []
    };
  }

  getEmptyLigne() {
    return { designation: '', quantite: 1, prix_unitaire: 0, magasin: '', etagere: '' };
  }

  resetCreateForm() {
    this.newPiece = this.getEmptyPiece();
    this.newLigne = this.getEmptyLigne();
    this.showCreateError = false;
    this.fileCreateError = '';
  }

  addLigneToNewPiece() {
    if (!this.newPiece.articles) this.newPiece.articles = [];
    this.newPiece.articles.push({ ...this.newLigne });
    this.newLigne = this.getEmptyLigne();
  }

  removeLigneFromNewPiece(i: number) {
    this.newPiece.articles.splice(i, 1);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.fileCreateError = 'Format de fichier non supporté.';
        this.newPiece.piece_justificative = null;
        return;
      }
      this.fileCreateError = '';
      this.newPiece.piece_justificative = file;
    } else {
      this.newPiece.piece_justificative = null;
    }
  }

  createPiece(piece: any) {
    // Validation dynamique
    if (!piece.numero_piece || !piece.date_piece || !piece.marche || !piece.categorie_article || !piece.telephone || !piece.tous_livres) {
      this.showCreateError = true;
      return;
    }
    this.showCreateError = false;
    piece.id = crypto.randomUUID();
    piece.date_piece = piece.date_piece || new Date().toISOString();
    this.entreeStockService.add(piece);
    this.pieces = this.entreeStockService.getAll();
    this.closeCreateModal();
    this.messageToast = 'Entrée créée avec succès !';
    setTimeout(() => { this.messageToast = ''; }, 2500);
  }

  get filteredPieces(): any[] {
    let result = this.pieces;
    // Recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(e =>
        (e.numero_piece && e.numero_piece.toLowerCase().includes(term)) ||
        (e.marche && e.marche.toLowerCase().includes(term))
      );
    }
    // Filtre statut
    if (this.filterStatut) {
      result = result.filter(e => e.statut === this.filterStatut);
    }
    // Filtre marchandise
    if (this.filterMarchandise) {
      const march = this.filterMarchandise.toLowerCase();
      result = result.filter(e => e.marche && e.marche.toLowerCase().includes(march));
    }
    // Filtre entre deux dates
    if (this.filterDateStart && this.filterDateEnd) {
      const start = new Date(this.filterDateStart);
      const end = new Date(this.filterDateEnd);
      result = result.filter(e => {
        const d = new Date(e.date_piece);
        return d >= start && d <= end;
      });
    } else if (this.filterDateStart) {
      const start = new Date(this.filterDateStart);
      result = result.filter(e => {
        const d = new Date(e.date_piece);
        return d >= start;
      });
    } else if (this.filterDateEnd) {
      const end = new Date(this.filterDateEnd);
      result = result.filter(e => {
        const d = new Date(e.date_piece);
        return d <= end;
      });
    }
    // Tri par date (plus récent d'abord)
    result = result.slice().sort((a, b) => new Date(b.date_piece).getTime() - new Date(a.date_piece).getTime());
    // Pagination
    const start = (this.currentPage - 1) * this.pageSize;
    return result.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    let result = this.pieces;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(e =>
        (e.numero_piece && e.numero_piece.toLowerCase().includes(term)) ||
        (e.marche && e.marche.toLowerCase().includes(term))
      );
    }
    if (this.filterStatut) {
      result = result.filter(e => e.statut === this.filterStatut);
    }
    if (this.filterMarchandise) {
      const march = this.filterMarchandise.toLowerCase();
      result = result.filter(e => e.marche && e.marche.toLowerCase().includes(march));
    }
    // Filtre entre deux dates
    if (this.filterDateStart && this.filterDateEnd) {
      const start = new Date(this.filterDateStart);
      const end = new Date(this.filterDateEnd);
      result = result.filter(e => {
        const d = new Date(e.date_piece);
        return d >= start && d <= end;
      });
    } else if (this.filterDateStart) {
      const start = new Date(this.filterDateStart);
      result = result.filter(e => {
        const d = new Date(e.date_piece);
        return d >= start;
      });
    } else if (this.filterDateEnd) {
      const end = new Date(this.filterDateEnd);
      result = result.filter(e => {
        const d = new Date(e.date_piece);
        return d <= end;
      });
    }
    return Math.ceil(result.length / this.pageSize) || 1;
  }

  setPage(page: number) {
    this.currentPage = page;
    this.selectedPiece = null;
  }

  onFilterChange() {
    this.currentPage = 1;
    this.selectedPiece = null;
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'cards' ? 'table' : 'cards';
  }

  openUpdate(piece: any) {
    this.updatePiece = { ...piece };
    this.showUpdateModal = true;
    this.showCreateError = false;
  }

  closeUpdateModal() {
    this.showUpdateModal = false;
    this.updatePiece = null;
  }

  saveUpdatePiece() {
    if (!this.updatePiece.numero_piece || !this.updatePiece.date_piece || !this.updatePiece.marche || !this.updatePiece.categorie_article || !this.updatePiece.telephone || !this.updatePiece.tous_livres) {
      this.showCreateError = true;
      return;
    }
    this.showCreateError = false;
    this.entreeStockService.update(this.updatePiece);
    this.pieces = this.entreeStockService.getAll();
    this.closeUpdateModal();
    this.selectedPiece = null;
    this.messageToast = 'Entrée mise à jour avec succès !';
    setTimeout(() => { this.messageToast = ''; }, 2500);
  }

  visualiserPieceJustificative(piece: any) {
    if (!piece.piece_justificative) return;
    
      const file = piece.piece_justificative;
    const fileType = file.type;
    
    // Pour les images, on peut les prévisualiser directement
    if (fileType.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60000); // 1 minute
    } 
    // Pour les PDFs
    else if (fileType === 'application/pdf') {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
    // Pour les autres types de fichiers, on les télécharge
    else {
      this.telechargerPieceJustificative(piece);
    }
  }

  getCategorieKeyFromCode(code: string): string | undefined {
    return Object.keys(ARTICLES_PAR_CATEGORIE).find(key => key.startsWith(code));
  }

  openArticleModal(piece: any, index: number | null = null) {
    this.showArticleModal = true;
    this.currentPiece = piece;
    
    // Si on n'est pas en mode édition, réinitialiser le formulaire
    if (index === null) {
      this.editMode = false;
      this.editIndex = -1;
    this.articleFormData = { designation: '', unite: '', prix_unitaire: '', quantite: '', date_peremption: '' };
      this.selectedArticle = '';
      this.selectedUnite = '';
    }
    
    this.localArticleList = [];
    const catKey = this.getCategorieKeyFromCode(piece.categorie_article);
    this.articleOptions = catKey ? ARTICLES_PAR_CATEGORIE[catKey] : [];
    this.articleFormSubmitted = false;
  }

  closeArticleModal() {
    this.showArticleModal = false;
    this.currentPiece = null;
    this.editMode = false;
    this.editIndex = -1;
    this.articleFormData = { designation: '', unite: '', prix_unitaire: '', quantite: '', date_peremption: '' };
    this.localArticleList = [];
    this.selectedArticle = '';
    this.selectedUnite = '';
    this.articleFormSubmitted = false;
  }

  onArticleChange() {
    this.selectedUnite = UNITE_PAR_ARTICLE[this.selectedArticle] || '';
    this.articleFormData.designation = this.selectedArticle;
    this.articleFormData.unite = this.selectedUnite;
  }

  editLocalArticle(index: number) {
    const article = this.localArticleList[index];
    console.log('Modification article:', article);
    
    // Passer en mode édition
    this.editMode = true;
    this.editIndex = index;
    
    // Remplir le formulaire
    this.articleFormData = {
      designation: article.designation,
      unite: article.unite,
      prix_unitaire: article.prix_unitaire,
      quantite: article.quantite,
      date_peremption: article.date_peremption
    };
    
    this.selectedArticle = article.designation;
    this.selectedUnite = article.unite;
    
    // Réinitialiser les erreurs
    this.articleFormSubmitted = false;
    
    // Scroll vers le haut
    setTimeout(() => {
      if (this.articleFormTop && this.articleFormTop.nativeElement) {
        this.articleFormTop.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  addArticleToLocalList() {
    this.articleFormSubmitted = true;
    
    if (!this.selectedArticle || !this.articleFormData.prix_unitaire || !this.articleFormData.quantite || !this.articleFormData.date_peremption) {
      return;
    }
    
    const articleToSave = {
      ...this.articleFormData,
      designation: this.selectedArticle,
      unite: this.selectedUnite,
      categorie: this.currentPiece.categorie_article
    };
    
    if (this.editMode) {
      // Mode modification
      this.localArticleList[this.editIndex] = articleToSave;
      this.messageToast = 'Article modifié avec succès !';
      this.editMode = false;
      this.editIndex = -1;
    } else {
      // Mode ajout
      this.localArticleList.push(articleToSave);
      this.messageToast = 'Article ajouté avec succès !';
    }
    
    // Réinitialiser le formulaire
    this.articleFormData = { designation: '', unite: '', prix_unitaire: '', quantite: '', date_peremption: '' };
    this.selectedArticle = '';
    this.selectedUnite = '';
    this.articleFormSubmitted = false;
    
    setTimeout(() => {
      this.messageToast = '';
    }, 2000);
  }

  deleteLocalArticle(index: number) {
    this.localArticleList.splice(index, 1);
  }

  validateAllArticles() {
    if (!this.currentPiece.articles) this.currentPiece.articles = [];
    this.currentPiece.articles.push(...this.localArticleList);
    this.entreeStockService.update(this.currentPiece);
    this.pieces = this.entreeStockService.getAll();
    this.closeArticleModal();
    this.messageToast = 'Articles ajoutés/modifiés avec succès !';
    setTimeout(() => { this.messageToast = ''; }, 2000);
  }

  editArticle(piece: any, index: number) {
    // Récupérer l'article à modifier
    const article = piece.articles[index];
    
    // Remonter les valeurs dans le formulaire
    this.selectedArticle = article.designation;
    this.selectedUnite = article.unite;
    this.articleFormData = {
      designation: article.designation,
      unite: article.unite,
      prix_unitaire: article.prix_unitaire,
      quantite: article.quantite,
      date_peremption: article.date_peremption
    };
    
    // Activer le mode édition
    this.editMode = true;
    this.editIndex = index;
    this.currentPiece = piece;
    
    // Ouvrir le modal
    this.openArticleModal(piece, index);
  }

  // Nouvelle fonction pour sauvegarder la modification d'un article existant
  saveArticleEdit() {
    if (!this.selectedArticle || !this.articleFormData.prix_unitaire || !this.articleFormData.quantite || !this.articleFormData.date_peremption) {
      return;
    }
    
    // Mettre à jour l'article existant
    this.currentPiece.articles[this.editIndex] = {
      designation: this.selectedArticle,
      unite: this.selectedUnite,
      prix_unitaire: this.articleFormData.prix_unitaire,
      quantite: this.articleFormData.quantite,
      date_peremption: this.articleFormData.date_peremption,
      categorie: this.currentPiece.categorie_article
    };
    
    // Sauvegarder les changements
    this.entreeStockService.update(this.currentPiece);
    this.pieces = this.entreeStockService.getAll();
    
    // Fermer le modal et réinitialiser
    this.closeArticleModal();
    
    // Afficher le message de confirmation
    this.messageToast = 'Article modifié avec succès !';
    setTimeout(() => { this.messageToast = ''; }, 2000);
  }

  deleteArticle(piece: any, index: number) {
    if (!piece.articles) return;
    
    // Demander confirmation
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }
    
    piece.articles.splice(index, 1);
    this.entreeStockService.update(piece);
    this.pieces = this.entreeStockService.getAll();
    
    // Afficher le message de confirmation
    this.messageToast = 'Article supprimé avec succès !';
    setTimeout(() => { this.messageToast = ''; }, 2000);
  }

  // Affiche le numéro de pièce avec la première lettre en majuscule si c'est une lettre
  capitalizeFirstLetter(str: string): string {
    if (!str) return '';
    return str.charAt(0).match(/[a-zA-Z]/) ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  }

  resetFilters() {
    this.filterStatut = '';
    this.filterMarchandise = '';
    this.filterDateStart = '';
    this.filterDateEnd = '';
    this.searchTerm = '';
    this.currentPage = 1;
  }

  setQuickRange(range: string) {
    const today = new Date();
    let start: Date, end: Date;
    switch (range) {
      case 'today':
        start = end = today;
        break;
      case 'week':
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay()); // début semaine (dimanche)
        end = new Date(today);
        end.setDate(start.getDate() + 6); // fin semaine (samedi)
        break;
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case '30days':
        start = new Date(today);
        start.setDate(today.getDate() - 29);
        end = today;
        break;
      default:
        start = end = today;
    }
    this.filterDateStart = start.toISOString().slice(0, 10);
    this.filterDateEnd = end.toISOString().slice(0, 10);
    this.showDateRange = false;
    this.onFilterChange();
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.showDateRange && this.dateRangeDropdown && !this.dateRangeDropdown.nativeElement.contains(event.target)) {
      this.showDateRange = false;
    }
  }

  // Ne fermer le dropdown qu'après la sélection de la date finale
  onDateStartChange() {
    this.onFilterChange();
    // Ne pas fermer le dropdown ici
  }
  onDateEndChange() {
    this.onFilterChange();
    this.showDateRange = false;
  }

  // Fermer tous les dropdowns d'options si on clique en dehors
  @HostListener('document:click', ['$event'])
  onClickOutsideCards(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // On ferme tous les dropdowns sauf si le click est sur un bouton d'option ou dans le menu
    setTimeout(() => {
      for (const piece of this.filteredPieces) {
        const isOptionBtn = target.closest('.card-action-menu-btn');
        const isMenu = target.closest('.card-action-menu-dropdown');
        if (!isOptionBtn && !isMenu) {
          piece.actionMenuOpen = false;
        }
      }
    }, 0);
  }

  getCategorieLabel(code: string): string {
    if (!code) return '';
    // Si déjà code + nom
    if (code.includes(' - ')) return code;
    // Cherche la catégorie qui commence par le code
    const found = CATEGORIES.find(cat => cat.startsWith(code + ' '));
    return found || code;
  }

  telechargerPieceJustificative(piece: any) {
    if (!piece.piece_justificative) return;
    
    const file = piece.piece_justificative;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || 'justificatif';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  // Nouvelle fonction pour déterminer si un fichier peut être prévisualisé
  canPreviewFile(piece: any): boolean {
    if (!piece.piece_justificative) return false;
    const fileType = piece.piece_justificative.type;
    return fileType.startsWith('image/') || fileType === 'application/pdf';
  }

  // Nouvelle fonction pour obtenir l'icône appropriée selon le type de fichier
  getFileIcon(piece: any): string {
    if (!piece.piece_justificative) return 'document';
    
    const fileType = piece.piece_justificative.type;
    if (fileType.startsWith('image/')) return 'photo';
    if (fileType === 'application/pdf') return 'document-text';
    return 'document';
  }

  trackByPieceId(index: number, piece: any): any {
    return piece.id;
  }

  toggleRow(piece: any) {
    this.expandedPiece = this.expandedPiece?.id === piece.id ? null : piece;
  }

  isArticleFormValid() {
    return this.selectedArticle && this.articleFormData.prix_unitaire && this.articleFormData.quantite && this.articleFormData.date_peremption;
  }
}
