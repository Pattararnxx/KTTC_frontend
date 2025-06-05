import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  fg = new  FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  onSubmit() {
    const username = this.fg.value.username ??'';
    const password = this.fg.value.password ??'';
    console.log('Form Data:', { username, password });
  }
}
