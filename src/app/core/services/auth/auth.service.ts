import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Admin} from '../../../shared/models/Admin.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #http = inject(HttpClient);
  #router = inject(Router);

  login(username:string, password:string) {
    return this.#http.post<Admin>('http://localhost:3000/auth/login',{
      username,
      password,
      expiresInMins: 60
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    this.#router.navigate(['/login']).then();
  }
}
