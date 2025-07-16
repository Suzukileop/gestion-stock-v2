import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarResponsableComponent } from './sidebar-responsable.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'dashboard-responsable',
  standalone: true,
  imports: [CommonModule, SidebarResponsableComponent, HeaderComponent],
  templateUrl: './dashboard-responsable.component.html',
})
export class DashboardResponsableComponent {} 