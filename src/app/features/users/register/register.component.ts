import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NavbarComponent} from '../../../components/navbar/navbar.component';
import {RegisterService} from '../../../shared/services/register/register.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    NavbarComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private registerService = inject(RegisterService);

  fg = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    affiliation: new FormControl('', Validators.required),
    seed_rank: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    slip_url: new FormControl(<File | null>null, Validators.required),
  })
  onsubmit(){
    if(this.fg.invalid){
      this.fg.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    formData.append('firstname', this.fg.value.firstname || '');
    formData.append('lastname', this.fg.value.lastname || '');
    formData.append('affiliation', this.fg.value.affiliation || '');
    formData.append('seed_rank', this.fg.value.seed_rank || '');
    formData.append('category', this.fg.value.category || '');
    const slipFile = this.fg.get('slip_url')?.value;
    if (slipFile instanceof File) {
      formData.append('slip_url', slipFile);
    }

    this.registerService.register(formData).subscribe({
      next: (res) => {
        alert('ลงทะเบียนสำเร็จ!');
        this.fg.reset();
      },
      error: (err) => {
        alert('เกิดข้อผิดพลาด: ' + (err.error?.message || err.message));
      }
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fg.get('slip_url')?.setValue(file);
      this.fg.get('slip_url')?.updateValueAndValidity();
    }
  }

}
