import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-confirmation-inscription',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './confirmation-inscription.component.html',
})
export class ConfirmationInscriptionComponent {
  constructor() {
    if (localStorage.getItem('showConfirmationPage') !== '1') {
      window.location.href = '/login';
    } else {
      localStorage.removeItem('showConfirmationPage');
    }
  }
} 