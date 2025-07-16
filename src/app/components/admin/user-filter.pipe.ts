import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFilter',
  standalone: true
})
export class UserFilterPipe implements PipeTransform {
  transform(users: any[], role: string, statut: string): any[] {
    return users.filter(u =>
      (role ? u.role === role : true) &&
      (statut ? u.statut === statut : true)
    );
  }
} 