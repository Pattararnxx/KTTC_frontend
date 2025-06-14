import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../../core/services/auth/auth.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-admin-login',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  #authService = inject(AuthService);
  #router = inject(Router);

  isLoading = false;
  errorMessage = '';
  showError = false;

  fg = new  FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  onSubmit() {
    if (this.fg.invalid) {
      this.showErrorMessage('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    const username = this.fg.value.username ??'';
    const password = this.fg.value.password ??'';

    this.isLoading = true;
    this.hideError();

    this.#authService.login(username, password).subscribe({
      next:(res)=>{
        console.log('logged in');
        console.log(res);
        this.isLoading = false;
        localStorage.setItem('access_token', res.access_token);
        this.#router.navigate(['/admin/approve']);
      },
      error:(err)=>{
        console.log('login failed');
        console.log(err);
        this.isLoading = false;

        if (err.status === 401) {
          this.showErrorMessage('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        } else if (err.status === 0) {
          this.showErrorMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        } else {
          this.showErrorMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        }
      },
      complete:()=>{
        console.log('login complete');
      }
    });
  }
  private showErrorMessage(message: string) {
    this.errorMessage = message;
    this.showError = true;
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }

  private hideError() {
    this.showError = false;
    this.errorMessage = '';
  }
}
