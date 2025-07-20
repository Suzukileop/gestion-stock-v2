import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BesoinsService, Besoin } from '../../services/besoins.service';
import { Observable } from 'rxjs';
import { SidebarResponsableComponent } from './sidebar-responsable.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'besoins-responsable',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, SidebarResponsableComponent, HeaderComponent],
  templateUrl: './besoins-responsable.component.html',
  styleUrls: ['./besoins-responsable.component.css']
})
export class BesoinsResponsableComponent implements OnInit {
  besoins$!: Observable<Besoin[]>;
  filteredBesoins: Besoin[] = [];
  searchTerm = '';
  filterStatut = '';
  viewMode: 'table' | 'cards' = 'table';
  motifRejet: { [id: number]: string } = {};
  showMotifRejet: { [id: number]: boolean } = {};
  showMotifRejetModal: boolean = false;
  besoinRejetModal: Besoin | null = null;
  showDetails: { [id: number]: boolean } = {};

  constructor(private besoinsService: BesoinsService) {}

  ngOnInit() {
    this.besoins$ = this.besoinsService.getBesoins();
    this.besoins$.subscribe(besoins => {
      this.filteredBesoins = besoins;
      this.onFilterChange();
    });
  }

  onFilterChange() {
    this.besoins$.subscribe(besoins => {
      this.filteredBesoins = besoins.filter(b => {
        if (b.statut === 'BROUILLON') return false;
        const matchesSearch = this.searchTerm === '' ||
          b.numero.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          b.motif.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          b.categorie.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          b.article?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          b.compte?.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesStatut = this.filterStatut === '' || b.statut === this.filterStatut;
        return matchesSearch && matchesStatut;
      });
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.filterStatut = '';
    this.onFilterChange();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
  }

  changerStatut(besoin: Besoin, statut: Besoin['statut']) {
    if (statut === 'REJETEE') {
      this.besoinRejetModal = besoin;
      this.showMotifRejetModal = true;
      this.motifRejet[besoin.id] = '';
    } else {
      this.besoinsService.updateStatut(besoin.id, statut);
      this.onFilterChange();
    }
  }

  validerMotifRejet() {
    if (!this.besoinRejetModal) return;
    this.besoinsService.updateStatut(this.besoinRejetModal.id, 'REJETEE');
    // Mettre à jour le motifRetour
    const besoins = (this.filteredBesoins || []).map(b =>
      b.id === this.besoinRejetModal!.id ? { ...b, motifRetour: this.motifRejet[this.besoinRejetModal!.id] } : b
    );
    localStorage.setItem('besoins-stock', JSON.stringify(besoins));
    this.showMotifRejetModal = false;
    this.besoinRejetModal = null;
    this.onFilterChange();
  }

  closeMotifRejetModal() {
    this.showMotifRejetModal = false;
    this.besoinRejetModal = null;
  }

  toggleDetails(besoin: Besoin) {
    this.showDetails[besoin.id] = !this.showDetails[besoin.id];
  }
} 