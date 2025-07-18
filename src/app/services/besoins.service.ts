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

const STORAGE_KEY = 'besoins-stock';

@Injectable({ providedIn: 'root' })
export class BesoinsService {
  private besoinsSubject = new BehaviorSubject<Besoin[]>([]);
  private besoins: Besoin[] = [];
  private idCounter = 1;

  constructor() {
    this.loadFromStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.besoins));
      localStorage.setItem(STORAGE_KEY + '-id', this.idCounter.toString());
    } catch (e) {
      console.error('[BesoinsService] Erreur lors de la sauvegarde dans localStorage:', e);
    }
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const id = localStorage.getItem(STORAGE_KEY + '-id');
      if (data) {
        try {
          this.besoins = JSON.parse(data).map((b: any) => ({ ...b, date: new Date(b.date) }));
        } catch (parseErr) {
          console.error('[BesoinsService] Erreur de parsing JSON des besoins:', parseErr);
          this.besoins = [];
        }
        this.besoinsSubject.next(this.besoins);
      }
      if (id) {
        this.idCounter = parseInt(id, 10);
      }
    } catch (e) {
      console.error('[BesoinsService] Erreur lors de la lecture du localStorage:', e);
      this.besoins = [];
      this.besoinsSubject.next(this.besoins);
    }
  }

  getBesoins(): Observable<Besoin[]> {
    this.loadFromStorage();
    this.besoinsSubject.next(this.besoins);
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
    this.saveToStorage();
  }

  updateStatut(id: number, statut: Besoin['statut']) {
    this.besoins = this.besoins.map(b => b.id === id ? { ...b, statut } : b);
    this.besoinsSubject.next(this.besoins);
    this.saveToStorage();
  }

  // Autres méthodes selon besoin (delete, edit, etc.)
} 