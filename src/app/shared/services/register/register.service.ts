import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private httpClient = inject(HttpClient);

  register(formData: FormData){
    return this.httpClient.post('http://localhost:3000/users',formData);
  }
}
