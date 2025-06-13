import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../../core/services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  #authService = inject(AuthService);
  #router = inject(Router);

  fg = new  FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  onSubmit() {
    const username = this.fg.value.username ??'';
    const password = this.fg.value.password ??'';
    this.#authService.login(username, password).subscribe({
      next:(res)=>{
        console.log('logged in');
        console.log(res);
        localStorage.setItem('access_token', res.accessToken);
        this.#router.navigate(['/admin/approve']);
      },
      error:(err)=>{
        console.log('login failed');
        console.log(err);
      },
      complete:()=>{
        console.log('login complete');
      }
    });
  }
}
