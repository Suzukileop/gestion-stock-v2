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
    this.besoinsService.updateStatut(besoin.id, statut);
    this.onFilterChange();
  }
} 