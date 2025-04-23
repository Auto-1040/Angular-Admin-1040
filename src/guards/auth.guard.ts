import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  
      if (userService.getCurrentUser() !== null) {
        return true;
      } else {
        router.navigate(['/login']); // Navigate to login page if not authorized
        return false;
      }
 }
  
