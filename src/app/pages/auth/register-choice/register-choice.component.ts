import { Component, inject } from '@angular/core';
import { UserRole } from '../../../models/user.model';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-register-choice',
  imports: [TranslatePipe],
  templateUrl: './register-choice.component.html',
  styleUrl: './register-choice.component.scss'
})
export class RegisterChoiceComponent {
  private router = inject(Router);

  goTo(role: UserRole ){
    switch (role) {
      case 'client':
        this.router.navigateByUrl('/register-client');
        break;
      case 'customer':
        this.router.navigateByUrl('/register-customer');
        break;
      default:
        this.router.navigateByUrl('/register');
    }
  }
}
