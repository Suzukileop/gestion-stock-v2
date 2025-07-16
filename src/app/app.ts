import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FlowbiteService } from './services/flowbite.service';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class=" min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <router-outlet></router-outlet>
    </div>
  `
})
export class App implements OnInit {
  constructor(
    private flowbiteService: FlowbiteService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.flowbiteService.loadFlowbite((flowbite) => {
      const { initFlowbite } = flowbite;
      initFlowbite();
    });
  }
}
