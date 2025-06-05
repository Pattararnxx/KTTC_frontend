import {Component, computed, signal} from '@angular/core';
import {SidebarComponent} from '../../../components/sidebar/sidebar.component';
import {Registration} from '../../../shared/models/Registration.model';

@Component({
  selector: 'app-admin-approve',
  imports: [
    SidebarComponent
  ],
  templateUrl: './admin-approve.component.html',
  styleUrl: './admin-approve.component.css'
})
export class AdminApproveComponent {
  private allRegistrations = signal<Registration[]>([
    {
      id: 1,
      firstname: 'ประโยชน์',
      lastname: 'ศรีจันทร์',
      affiliation: 'สสอบวงกรีกีฬา',
      seed_rank: '-',
      category: 'ชายเดี่ยวทั่วไป',
      slip_url: 'assets/slips/slip_001.jpg',
      is_paid: false,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      firstname: 'สมชาย',
      lastname: 'ใจดี',
      affiliation: 'สโมสรแบดมินตัน ABC',
      seed_rank: '30',
      category: 'ชายเดี่ยวรุ่นอายุไม่เกิน 40 ปี',
      slip_url: 'assets/slips/slip_002.jpg',
      is_paid: false,
      created_at: '2024-01-14T14:20:00Z',
      updated_at: '2024-01-14T16:45:00Z'
    },
    {
      id: 3,
      firstname: 'วิชัย',
      lastname: 'รักเกม',
      affiliation: 'มหาวิทยาลัย XYZ',
      seed_rank: '-',
      category: 'ชายเดี่ยวทั่วไป',
      slip_url: 'assets/slips/slip_003.jpg',
      is_paid: true,
      created_at: '2024-01-16T09:00:00Z',
      updated_at: '2024-01-16T09:00:00Z'
    },
    {
      id: 4,
      firstname: 'นิภา',
      lastname: 'สวยงาม',
      affiliation: 'บริษัท DEF จำกัด',
      seed_rank: '10',
      category: 'หญิงเดี่ยวทั่วไป',
      slip_url: 'assets/slips/slip_004.jpg',
      is_paid: false,
      created_at: '2024-01-17T11:15:00Z',
      updated_at: '2024-01-17T11:15:00Z'
    }
  ]);

  registrations = computed(() =>
    this.allRegistrations().filter(reg => !reg.is_paid)
  );

  approve(id: number) {
    this.allRegistrations.update((list) =>
      list.map(reg => reg.id === id ? { ...reg, is_paid: true } : reg)
    );
  }
}
