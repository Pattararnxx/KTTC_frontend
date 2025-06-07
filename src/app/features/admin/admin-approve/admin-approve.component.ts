import {Component, computed, inject, signal} from '@angular/core';
import {SidebarComponent} from '../../../components/sidebar/sidebar.component';
import {Registration} from '../../../shared/models/Registration.model';
import {PaymentCheckService} from '../../../shared/services/payment-check/payment-check.service';

@Component({
  selector: 'app-admin-approve',
  imports: [
    SidebarComponent
  ],
  templateUrl: './admin-approve.component.html',
  styleUrl: './admin-approve.component.css'
})
export class AdminApproveComponent {
  private paymentCheckService = inject(PaymentCheckService);

  private allRegistrations = signal<Registration[]>([]);
  loading = signal(false);

  registrations = computed(() =>
    this.allRegistrations().filter(reg => !reg.is_paid)
  );

  constructor() {
    this.fetchUnpaidUsers();
  }

  fetchUnpaidUsers() {
    this.loading.set(true);
    this.paymentCheckService.getUnpaidUsers().subscribe({
      next: (regs) => {
        this.allRegistrations.set(regs);
        this.loading.set(false);
      },
      error: () => {
        this.allRegistrations.set([]);
        this.loading.set(false);
      }
    });
  }

  approve(id: number) {
    this.paymentCheckService.approveUser(id).subscribe({
      next: () => {
        this.fetchUnpaidUsers();
      }
    });
  }
}
