import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Payment} from '../../../shared/models/Payment.model';
import {NgIf} from '@angular/common';
import {NavbarComponent} from '../../../components/navbar/navbar.component';
import {PaymentCheckService} from '../../../shared/services/payment-check/payment-check.service';

@Component({
  selector: 'app-payment-check',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NavbarComponent
  ],
  templateUrl: './payment-check.component.html',
  styleUrl: './payment-check.component.css'
})
export class PaymentCheckComponent {
  private paymentCheckService = inject(PaymentCheckService);

  foundUsers = signal<Payment[]>([]);
  statusMessage = signal('');

  searchForm = new FormGroup({
    query: new FormControl(''),
  });

  onSubmit() {
    const query = this.searchForm.value.query?.trim().toLowerCase() || '';

    if (!query) {
      this.statusMessage.set('กรุณากรอกชื่อ หรือ นามสกุล');
      this.foundUsers.set([]);
      return;
    }

    this.paymentCheckService.searchUser(query).subscribe({
      next: (result) => {
        this.foundUsers.set(result);
        if (result.length === 0) {
          this.statusMessage.set('ไม่พบข้อมูลผู้สมัคร');
        } else {
          this.statusMessage.set('');
        }
      },
      error: () => {
        this.statusMessage.set('เกิดข้อผิดพลาดในการค้นหา');
      }
    });
  }
}
