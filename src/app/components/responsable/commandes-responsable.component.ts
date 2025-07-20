import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarResponsableComponent } from './sidebar-responsable.component';

interface Commande {
  id: number;
  numero: string;
  client_id: number;
  date: string;
  statut: 'ENVOYEE' | 'VALIDEE' | 'REJETEE' | 'BROUILLON' | 'LIVREE';
  articles: any[];
  compte: string;
  motif: string;
  motifRetour?: string;
  clientNom?: string;
}

@Component({
  selector: 'commandes-responsable',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, SidebarResponsableComponent],
  templateUrl: './commandes-responsable.component.html',
  styleUrls: ['./commandes-responsable.component.css']
})
export class CommandesResponsableComponent implements OnInit {
  commandes: Commande[] = [];
  filteredCommandes: Commande[] = [];
  motifRejet: { [id: number]: string } = {};
  showMotifRejetModal: boolean = false;
  commandeRejetModal: Commande | null = null;
  showDetails: { [id: number]: boolean } = {};
  searchTerm = '';
  filterStatut = '';

  ngOnInit() {
    this.loadCommandes();
  }

  loadCommandes() {
    const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
    this.commandes = commandes.filter((c: Commande) => c.statut !== 'BROUILLON');
    this.filteredCommandes = [...this.commandes];
  }

  onFilterChange() {
    this.filteredCommandes = this.commandes.filter(cmd => {
      const search = this.searchTerm.trim().toLowerCase();
      const matchSearch = !search ||
        cmd.numero?.toLowerCase().includes(search) ||
        cmd.compte?.toLowerCase().includes(search) ||
        cmd.motif?.toLowerCase().includes(search);
      const matchStatut = !this.filterStatut || cmd.statut === this.filterStatut;
      return matchSearch && matchStatut;
    });
  }

  changerStatut(cmd: Commande, statut: Commande['statut']) {
    if (statut === 'REJETEE') {
      this.commandeRejetModal = cmd;
      this.showMotifRejetModal = true;
      this.motifRejet[cmd.id] = '';
    } else {
      this.updateCommandeStatut(cmd, statut);
    }
  }

  validerMotifRejet() {
    if (!this.commandeRejetModal) return;
    this.updateCommandeStatut(this.commandeRejetModal, 'REJETEE', this.motifRejet[this.commandeRejetModal.id]);
    this.showMotifRejetModal = false;
    this.commandeRejetModal = null;
  }

  closeMotifRejetModal() {
    this.showMotifRejetModal = false;
    this.commandeRejetModal = null;
  }

  updateCommandeStatut(cmd: Commande, statut: Commande['statut'], motifRetour?: string) {
    const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
    const idx = commandes.findIndex((c: any) => c.id === cmd.id);
    if (idx !== -1) {
      commandes[idx].statut = statut;
      if (motifRetour) commandes[idx].motifRetour = motifRetour;
      localStorage.setItem('commandes', JSON.stringify(commandes));
      this.loadCommandes();
    }
  }

  toggleDetails(cmd: Commande) {
    this.showDetails[cmd.id] = !this.showDetails[cmd.id];
  }
} 