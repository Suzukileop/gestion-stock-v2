import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EntreeStockService {
  private key = 'entreesStock';

  getAll(): any[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  getById(id: string): any {
    return this.getAll().find(e => e.id === id);
  }

  add(entree: any) {
    const all = this.getAll();
    if (!entree.id) {
      entree.id = crypto.randomUUID();
    }
    all.push(entree);
    this.saveAll(all);
  }

  update(entree: any) {
    const all = this.getAll().map(e => e.id === entree.id ? entree : e);
    this.saveAll(all);
  }

  delete(id: string) {
    const all = this.getAll().filter(e => e.id !== id);
    this.saveAll(all);
  }

  saveAll(data: any[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  ensureIds() {
    const all = this.getAll();
    let changed = false;
    for (const e of all) {
      if (!e.id) {
        e.id = crypto.randomUUID();
        changed = true;
      }
    }
    if (changed) {
      this.saveAll(all);
    }
  }

  constructor() {
    this.ensureIds();
  }
}

