import {Component, computed, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Player} from '../../../shared/models/Player.model';

@Component({
  selector: 'app-check-match',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './check-match.component.html',
  styleUrl: './check-match.component.css'
})
export class CheckMatchComponent {
  categories = ['ชายเดี่ยวทั่วไป', 'หญิงเดี่ยวทั่วไป', 'ชายเดี่ยว 40 ปี', 'หญิงเดี่ยว 40 ปี'];
  groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  mockData = signal<{[key: string]: { players: Player[], results: (string | null)[][] }}>({
    'ชายเดี่ยวทั่วไป-A': {
      players: [
        { name: 'โครงมัจ', points: 6 },
        { name: 'ดิณนภพ', points: 2 },
        { name: 'ชานนท์', points: 1 },
        { name: 'อภิชาติ', points: 3 }
      ],
      results: [
        ['-', '2-0', '2-1', '2-0'],
        ['0-2', '-', null, '2-1'],
        ['1-2', null, '-', '0-2'],
        ['0-2', '1-2', '2-0', '-']
      ]
    },
    'ชายเดี่ยวทั่วไป-B': {
      players: [
        { name: 'สมชาย', points: 4 },
        { name: 'สมศักดิ์', points: 6 },
        { name: 'สมหมาย', points: 2 },
        { name: 'สมบัติ', points: 0 }
      ],
      results: [
        ['-', '1-2', '2-0', '2-1'],
        ['2-1', '-', '2-0', '2-0'],
        ['0-2', '0-2', '-', null],
        ['1-2', '0-2', null, '-']
      ]
    },
    'หญิงเดี่ยวทั่วไป-A': {
      players: [
        { name: 'สมหญิง', points: 6 },
        { name: 'มาลี', points: 4 },
        { name: 'จันทร์', points: 2 },
        { name: 'ดาว', points: 0 }
      ],
      results: [
        ['-', '2-1', '2-0', '2-0'],
        ['1-2', '-', '2-0', null],
        ['0-2', '0-2', '-', '2-1'],
        ['0-2', null, '1-2', '-']
      ]
    }
  });

  fg = new FormGroup({
    category: new FormControl(''),
    group: new FormControl(''),
    round: new FormControl('group'),
  })

  selectedCategory = signal<string>('');
  selectedGroup = signal<string>('');
  selectedRound = signal<string>('');

  currentPlayers = computed(() => {
    const key = `${this.selectedCategory()}-${this.selectedGroup()}`;
    const data = this.mockData()[key];
    return data?.players || [];
  });

  currentResults = computed(() => {
    const key = `${this.selectedCategory()}-${this.selectedGroup()}`;
    const data = this.mockData()[key];
    return data?.results || [];
  });

  hasData = computed(() => {
    return this.currentPlayers().length > 0;
  });

  formTitle = computed(() => {
    const category = this.selectedCategory();
    const group = this.selectedGroup();
    if (category && group) {
      return `${category} - สาย ${group}`;
    }
    return 'เลือกประเภทและสายการแข่งขัน';
  });

  constructor() {
    this.fg.valueChanges.subscribe(values => {
      console.log('Form values changed:', values);

      if (values.category) {
        this.selectedCategory.set(values.category);
      }
      if (values.group) {
        this.selectedGroup.set(values.group);
      }
      if (values.round) {
        this.selectedRound.set(values.round);
      }
    });
  }

  getMatchResult(playerIndex: number, opponentIndex: number): string {
    const results = this.currentResults();

    if (!results || !results[playerIndex]) {
      return '-';
    }

    const result = results[playerIndex][opponentIndex];

    if (result === '-') return '-';
    if (result === null || result === undefined) return 'รอแข่ง';
    return result as string;
  }

  getCellClass(match: string): string {
    if (match === '-') return 'text-gray-400';
    if (match === 'รอแข่ง') return 'text-orange-500 bg-orange-50 px-2 py-1 rounded text-sm';

    const scores = match.split('-');
    if (scores.length === 2) {
      const score1 = parseInt(scores[0]);
      const score2 = parseInt(scores[1]);
      return score1 > score2 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold';
    }
    return '';
  }
  onFormChange() {
    console.log('Current selections:', {
      category: this.selectedCategory(),
      group: this.selectedGroup(),
      round: this.selectedRound(),
      hasData: this.hasData(),
      playersCount: this.currentPlayers().length
    });
  }

}
