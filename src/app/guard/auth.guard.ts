import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { CanActivate, CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter((value) => value !== null),
      take(1),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          this.router.navigateByUrl('/login');
          return false;
        }
      })
    );
  }
}
