import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sidebar-responsable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-responsable.component.html',
})
export class SidebarResponsableComponent implements OnInit {
  isVisible = false;
  user: any = null;
  menu = [
    { label: 'Tableau de bord', icon: 'home', route: '/responsable/dashboard' },
    { label: 'Entrées en stock', icon: 'plus-circle', route: '/responsable/entrees-stock' },
    { label: 'Inventaire', icon: 'clipboard-list', route: '/responsable/inventaire' },
    { label: 'Expression de besoins', icon: 'document-text', route: '/responsable/besoins' },
    { label: 'Livraison & Affectation', icon: 'truck', route: '/responsable/affectations' },
  ];

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (user && user.role === 'RESPONSABLE') {
      this.isVisible = true;
      this.user = user;
    }
  }

  onMenuClick(item: any) {
    if (item.action === 'logout') {
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    } else if (item.route) {
      window.location.href = item.route;
    }
  }

  getIcon(name: string): string {
    const icons: any = {
      home: `<svg class='w-5 h-5' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6'/></svg>`,
      users: `<svg class='w-5 h-5' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-7a4 4 0 11-8 0 4 4 0 018 0zm6 7a4 4 0 00-3-3.87'/></svg>`,
      'plus-circle': `<svg class='w-5 h-5' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 4v16m8-8H4'/></svg>`,
      truck: `<svg class='w-5 h-5' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M9 17v-6a2 2 0 012-2h6a2 2 0 012 2v6m-2 0a2 2 0 11-4 0m4 0a2 2 0 11-4 0M5 17a2 2 0 11-4 0m4 0a2 2 0 11-4 0'/></svg>`,
      'clipboard-list': `<svg class='w-5 h-5' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M9 5h6a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2zm0 0V3a2 2 0 012-2h2a2 2 0 012 2v2'/></svg>`,
      archive: `<svg class='w-5 h-5' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M20.54 5.23A2 2 0 0020 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-.46-1.27zM16 10l-4 4-4-4'/></svg>`,
      tag: `<svg class='w-5 h-5' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M7 7a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 01-1 1H8a1 1 0 01-1-1V7zm0 0V5a2 2 0 012-2h6a2 2 0 012 2v2'/></svg>`,
      'document-text': `<svg class='w-5 h-5' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M7 7h10M7 11h10M7 15h6'/></svg>`,
      'user-check': `<svg class='w-5 h-5' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M16 17v-1a4 4 0 00-3-3.87M9 17H4v-2a4 4 0 013-3.87m9-7a4 4 0 11-8 0 4 4 0 018 0zm6 7a4 4 0 00-3-3.87'/></svg>`,
      'chart-bar': `<svg class='w-5 h-5' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M3 3v18h18'/><rect x='7' y='13' width='3' height='5' rx='1'/><rect x='12' y='9' width='3' height='9' rx='1'/><rect x='17' y='5' width='3' height='13' rx='1'/></svg>`,
      user: `<svg class='w-5 h-5' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z'/></svg>`,
      logout: `<svg class='w-5 h-5' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1'/></svg>`,
    };
    return icons[name] || '';
  }

  isActive(item: any): boolean {
    return item.route && window.location.pathname === item.route;
  }
} 