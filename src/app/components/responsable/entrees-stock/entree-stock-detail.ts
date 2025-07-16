import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EntreeStockService } from '../../../services/entree-stock.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidebarResponsableComponent } from '../sidebar-responsable.component';

@Component({
  selector: 'entree-stock-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarResponsableComponent],
  templateUrl: './entree-stock-detail.html',
  styleUrls: ['./entree-stock-detail.css']
})
export class EntreeStockDetailComponent implements OnInit {
  entree: any = null;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private entreeStockService: EntreeStockService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entree = this.entreeStockService.getById(id);
      if (!this.entree) this.notFound = true;
    } else {
      this.notFound = true;
    }
  }

  goBack() {
    this.router.navigate(['/responsable/entrees-stock']);
  }
} 