import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Besoin {
  id: number;
  numero: string;
  date: Date;
  dateDebut?: Date;
  dateFin?: Date;
  motif: string;
  categorie: string;
  article: string;
  unite: string;
  quantite: number;
  compte: string;
  statut: 'BROUILLON' | 'ENVOYEE' | 'EN_COURS' | 'VALIDEE' | 'REJETEE';
}

@Injectable({ providedIn: 'root' })
export class BesoinsService {
  private besoinsSubject = new BehaviorSubject<Besoin[]>([]);
  private besoins: Besoin[] = [];
  private idCounter = 1;

  getBesoins(): Observable<Besoin[]> {
    return this.besoinsSubject.asObservable();
  }

  addBesoin(besoin: Omit<Besoin, 'id' | 'numero' | 'date'>) {
    const newBesoin: Besoin = {
      ...besoin,
      id: this.idCounter++,
      numero: 'BSN-' + (this.idCounter - 1).toString().padStart(4, '0'),
      date: new Date(),
    };
    this.besoins = [newBesoin, ...this.besoins];
    this.besoinsSubject.next(this.besoins);
  }

  updateStatut(id: number, statut: Besoin['statut']) {
    this.besoins = this.besoins.map(b => b.id === id ? { ...b, statut } : b);
    this.besoinsSubject.next(this.besoins);
  }

  // Autres méthodes selon besoin (delete, edit, etc.)
} 