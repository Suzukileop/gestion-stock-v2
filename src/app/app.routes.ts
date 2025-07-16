import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirmation-inscription', loadComponent: () => import('./components/auth/confirmation-inscription.component').then(m => m.ConfirmationInscriptionComponent) },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin/users', loadComponent: () => import('./components/admin/admin-user-management.component').then(m => m.AdminUserManagementComponent) },
  { path: 'responsable/dashboard', loadComponent: () => import('./components/responsable/dashboard-responsable.component').then(m => m.DashboardResponsableComponent) },
  { path: 'responsable/entrees-stock', loadComponent: () => import('./components/responsable/entrees-stock/entrees-stock').then(m => m.EntreesStockComponent) },
  { path: 'responsable/entrees-stock/nouvelle', loadComponent: () => import('./components/responsable/entrees-stock/entree-stock-form').then(m => m.EntreeStockFormComponent) },
  { path: 'responsable/entrees-stock/:id', loadComponent: () => import('./components/responsable/entrees-stock/entree-stock-detail').then(m => m.EntreeStockDetailComponent) },
  { path: 'client/dashboard', loadComponent: () => import('./components/client/dashboard/dashboard.component').then(m => m.DashboardClientComponent) },
  { path: 'client/commandes', loadComponent: () => import('./components/client/commandes/commandes.component').then(m => m.CommandesClientComponent) },
  { path: 'client/besoins', loadComponent: () => import('./components/client/besoins.component').then(m => m.BesoinsClientComponent) },
  // Ajoutez ici d'autres routes pour votre application (tableau de bord, etc.)
  { path: '**', redirectTo: '/login' } // Rediriger les routes inconnues vers la page de connexion
];
