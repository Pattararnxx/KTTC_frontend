import {Component, signal} from '@angular/core';
import {SidebarComponent} from '../../../components/sidebar/sidebar.component';
import {Registration} from '../../../shared/models/Registration.model';

type Group = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
const GROUPS: Group[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

@Component({
  selector: 'app-divide-groups',
  imports: [
    SidebarComponent
  ],
  templateUrl: './divide-groups.component.html',
  styleUrl: './divide-groups.component.css'
})
export class DivideGroupsComponent {
  private allPlayers = signal<Registration[]>([
    // ชายเดี่ยวทั่วไป
    { id: 1, firstname: 'สมชาย', lastname: 'ใจดี', affiliation: 'สโมสร A', seed_rank: '-', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 2, firstname: 'สมปอง', lastname: 'สบายดี', affiliation: 'สโมสร B', seed_rank: '1', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 3, firstname: 'สมศรี', lastname: 'ยิ้มแย้ม', affiliation: 'สโมสร A', seed_rank: '-', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 8, firstname: 'วุฒิชัย', lastname: 'กล้าหาญ', affiliation: 'สโมสร C', seed_rank: '-', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 9, firstname: 'ธนากร', lastname: 'ใจเด็ด', affiliation: 'สโมสร D', seed_rank: '-', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 10, firstname: 'อภิชาติ', lastname: 'ว่องไว', affiliation: 'สโมสร B', seed_rank: '-', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 11, firstname: 'ภาคภูมิ', lastname: 'มั่นคง', affiliation: 'สโมสร D', seed_rank: '2', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 12, firstname: 'ธีรวัฒน์', lastname: 'สุขใจ', affiliation: 'สโมสร C', seed_rank: '-', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 13, firstname: 'ณัฐพล', lastname: 'แกร่งกล้า', affiliation: 'สโมสร E', seed_rank: '-', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 14, firstname: 'มานพ', lastname: 'ไวพริบ', affiliation: 'สโมสร E', seed_rank: '-', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 15, firstname: 'ยุทธนา', lastname: 'ใจสู้', affiliation: 'สโมสร F', seed_rank: '3', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 16, firstname: 'ประเสริฐ', lastname: 'เด็ดเดี่ยว', affiliation: 'สโมสร G', seed_rank: '-', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 17, firstname: 'จักรพงษ์', lastname: 'ฉลาด', affiliation: 'สโมสร H', seed_rank: '-', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 18, firstname: 'อนันต์', lastname: 'เร็วแรง', affiliation: 'สโมสร I', seed_rank: '-', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 19, firstname: 'ธีรพงษ์', lastname: 'สู้สุดใจ', affiliation: 'สโมสร F', seed_rank: '-', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 20, firstname: 'คณิน', lastname: 'ตั้งมั่น', affiliation: 'สโมสร J', seed_rank: '-', category: 'ชายเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},

    // หญิงเดี่ยวทั่วไป
    { id: 4, firstname: 'นิภา', lastname: 'ใจดี', affiliation: 'โรงเรียนหญิง Z', seed_rank: '-', category: 'หญิงเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 5, firstname: 'สายฝน', lastname: 'รักเรียน', affiliation: 'โรงเรียนหญิง Z', seed_rank: '2', category: 'หญิงเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 21, firstname: 'สุรีรัตน์', lastname: 'กล้าหาญ', affiliation: 'โรงเรียนหญิง X', seed_rank: '-', category: 'หญิงเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 22, firstname: 'พิมพ์ใจ', lastname: 'แน่วแน่', affiliation: 'โรงเรียนหญิง Y', seed_rank: '-', category: 'หญิงเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 23, firstname: 'รัตนา', lastname: 'ตั้งใจ', affiliation: 'โรงเรียนหญิง X', seed_rank: '1', category: 'หญิงเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: '' },
    { id: 24, firstname: 'ชุติมา', lastname: 'ไวไว', affiliation: 'โรงเรียนหญิง Y', seed_rank: '-', category: 'หญิงเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 25, firstname: 'ปิยนุช', lastname: 'ตั้งมั่น', affiliation: 'โรงเรียนหญิง W', seed_rank: '-', category: 'หญิงเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},
    { id: 26, firstname: 'กัญญา', lastname: 'ฉลาด', affiliation: 'โรงเรียนหญิง W', seed_rank: '-', category: 'หญิงเดี่ยวทั่วไป', slip_url: '', is_paid: true, created_at: ''},

    // ชายเดี่ยวรุ่นไม่เกิน 40 ปี
    { id: 6, firstname: 'วินัย', lastname: 'ขยันขันแข็ง', affiliation: 'ชมรมผู้ใหญ่ A', seed_rank: '-', category: 'ชายเดี่ยวรุ่นอายุไม่เกิน 40 ปี', slip_url: '', is_paid: true, created_at: ''},
    { id: 7, firstname: 'พีระ', lastname: 'ตั้งใจ', affiliation: 'ชมรมผู้ใหญ่ B', seed_rank: '3', category: 'ชายเดี่ยวรุ่นอายุไม่เกิน 40 ปี', slip_url: '', is_paid: true, created_at: ''},
  ]);
  readonly GROUPS = GROUPS;

  groupedResults = signal<Record<string, Record<Group, Registration[]>>>({});
  knockoutSeeds = signal<Record<string, Registration[]>>({});

  drawGroups(){
    const all = this.allPlayers().filter(p => p.is_paid);
    const categories = Array.from(new Set(all.map(p => p.category)));

    const results: Record<string, Record<Group, Registration[]>> = {};
    const knockout: Record<string, Registration[]> = {};

    for (const category of categories) {
      const players = all.filter(p => p.category === category);
      const seeded = players.filter(p => p.seed_rank !== '-');
      const unseeded = players.filter(p => p.seed_rank === '-');

      const groups: Record<Group, Registration[]> = GROUPS.reduce((acc, g) => {
        acc[g] = [];
        return acc;
      }, {} as Record<Group, Registration[]>);

      const shuffled = this.shuffle([...unseeded]);
      for (const player of shuffled) {
        const possibleGroups = GROUPS.filter(g =>
          !groups[g].some(p => p.affiliation === player.affiliation)
        );

        const selectedGroup = possibleGroups.length > 0
          ? this.leastFilled(possibleGroups, groups)
          : this.leastFilled(GROUPS, groups);

        groups[selectedGroup].push(player);
      }

      results[category] = groups;
      knockout[category] = seeded;
    }

    this.groupedResults.set(results);
    this.knockoutSeeds.set(knockout);
  }

  private shuffle<T>(arr: T[]): T[] {
    return arr
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
  private leastFilled(groups: Group[], map: Record<Group, Registration[]>) {
    return groups.reduce((prev, curr) =>
      map[curr].length < map[prev].length ? curr : prev
    );
  }
  groupByCategoryKeys(): string[] {
    return Object.keys(this.groupedResults());
  }

}
