import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Payment} from '../../models/Payment.model';
import {Registration} from '../../models/Registration.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentCheckService {
  private http = inject(HttpClient);

  searchUser(query: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`http://localhost:3000/users/payments/search?query=${encodeURIComponent(query)}`);
  }

  getUnpaidUsers(): Observable<Registration[]> {
    return this.http.get<Registration[]>(`http://localhost:3000/users/unpaid`);
  }

  approveUser(id: number): Observable<Registration[]> {
    return this.http.patch<Registration[]>(`http://localhost:3000/users/${id}/approve`, {});
  }
}
