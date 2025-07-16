import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sidebar-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="w-64 h-full flex flex-col justify-between bg-white dark:bg-gray-900/80 border border-gray-200 rounded-lg dark:border-gray-700 shadow-2xl backdrop-blur-lg animate-fade-in overflow-hidden transition-all duration-500 p-4 relative">
      <!-- Menu navigation -->
      <ul class="flex-1 flex flex-col gap-3 pt-4">
        <li>
          <a routerLink="/client/dashboard" routerLinkActive="bg-fuchsia-100/60 dark:bg-fuchsia-900/40 text-fuchsia-500 dark:text-fuchsia-200 shadow" class="group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left whitespace-nowrap text-sm transition-all duration-300 bg-gradient-to-r from-transparent to-transparent focus:outline-none focus:ring-2 focus:ring-fuchsia-400 relative overflow-hidden text-gray-400 dark:text-gray-400 hover:text-fuchsia-400 dark:hover:text-fuchsia-200 hover:bg-fuchsia-50/60 dark:hover:bg-fuchsia-900/30 font-normal items-center">
            <span class="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 min-w-[1.5rem] flex items-center justify-center">
              <!-- bar-chart -->
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-dashboard w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 3v18h18"/>
                <rect x="6" y="10" width="2" height="8" />
                <rect x="10" y="6" width="2" height="12" />
                <rect x="14" y="12" width="2" height="6" />
          </svg>
            </span>
            <span class="whitespace-nowrap transition-colors duration-300 group-hover:text-fuchsia-500 group-focus:text-fuchsia-700 dark:group-hover:text-fuchsia-200 font-semibold text-gray-500 dark:text-gray-400 flex flex-col justify-center h-full">Tableau de bord</span>
        </a>
        </li>
        <li>
          <a routerLink="/client/commandes" routerLinkActive="bg-fuchsia-100/60 dark:bg-fuchsia-900/40 text-fuchsia-500 dark:text-fuchsia-200 shadow" class="group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left whitespace-nowrap text-sm transition-all duration-300 bg-gradient-to-r from-transparent to-transparent focus:outline-none focus:ring-2 focus:ring-fuchsia-400 relative overflow-hidden text-gray-400 dark:text-gray-400 hover:text-fuchsia-400 dark:hover:text-fuchsia-200 hover:bg-fuchsia-50/60 dark:hover:bg-fuchsia-900/30 font-normal items-center">
            <span class="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 min-w-[1.5rem] flex items-center justify-center">
              <!-- icon-commande -->
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-commande w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 6h15l-1.5 9h-13z" />
                <circle cx="9" cy="20" r="1.5"/>
                <circle cx="18" cy="20" r="1.5"/>
                <path d="M6 6L4 2H2" />
          </svg>
            </span>
            <span class="whitespace-nowrap transition-colors duration-300 group-hover:text-fuchsia-500 group-focus:text-fuchsia-700 dark:group-hover:text-fuchsia-200 font-semibold text-gray-500 dark:text-gray-400 flex flex-col justify-center h-full">Mes commandes</span>
        </a>
        </li>
        <li>
          <a routerLink="/client/besoins" class="group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left whitespace-nowrap text-sm transition-all duration-300 bg-gradient-to-r from-transparent to-transparent focus:outline-none focus:ring-2 focus:ring-fuchsia-400 relative overflow-hidden text-gray-400 dark:text-gray-400 hover:text-fuchsia-400 dark:hover:text-fuchsia-200 hover:bg-fuchsia-50/60 dark:hover:bg-fuchsia-900/30 font-normal items-center">
            <span class="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 min-w-[1.5rem] flex items-center justify-center">
              <!-- document -->
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-besoins w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M8 8h4M8 12h8M8 16h8"/>
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
          </svg>
            </span>
            <span class="whitespace-nowrap transition-colors duration-300 group-hover:text-fuchsia-500 group-focus:text-fuchsia-700 dark:group-hover:text-fuchsia-200 font-semibold text-gray-500 dark:text-gray-400 flex flex-col justify-center h-full">Expression de besoin</span>
          </a>
        </li>
      </ul>
      <!-- Bloc info profil et déconnexion en bas -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center w-full absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900/80">
        <button class="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 transition font-semibold whitespace-nowrap text-sm shadow focus:outline-none focus:ring-2 focus:ring-fuchsia-400 mb-2">
          <svg class="w-5 h-5 text-fuchsia-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"/></svg>
          Information de profil
        </button>
        <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition font-semibold whitespace-nowrap text-sm shadow focus:outline-none focus:ring-2 focus:ring-red-400 max-w-full">
          <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"/></svg>
          Déconnexion
        </button>
      </div>
      </nav>
  `,
  styles: [],
})
export class SidebarClientComponent {
  logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  }
} 