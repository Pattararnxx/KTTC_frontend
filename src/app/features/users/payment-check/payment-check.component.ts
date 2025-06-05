import {Component, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Payment} from '../../../shared/models/Payment.model';
import {NgIf} from '@angular/common';
import {NavbarComponent} from '../../../components/navbar/navbar.component';

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


  foundUsers = signal<Payment[]>([]);
  statusMessage = signal('');

  allUsers = [
    { firstname: 'สมชาย', lastname: 'ใจดี', is_paid: true },
    { firstname: 'สมชาย', lastname: 'แสงทอง', is_paid: false },
    { firstname: 'สมหญิง', lastname: 'แสงทอง', is_paid: true },
    { firstname: 'สมชาย', lastname: 'ทองดี', is_paid: false },
  ];

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

    const filtered = this.allUsers.filter(user => {
      const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
      return (
        user.firstname.toLowerCase().includes(query) ||
        user.lastname.toLowerCase().includes(query) ||
        fullName.includes(query)
      );
    });

    this.foundUsers.set(filtered);

    if (filtered.length === 0) {
      this.statusMessage.set('ไม่พบข้อมูลผู้สมัคร');
    } else {
      this.statusMessage.set('');
    }

  }

}
