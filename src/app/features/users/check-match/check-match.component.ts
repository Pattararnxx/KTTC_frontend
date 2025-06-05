import {Component, computed, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Player} from '../../../shared/models/Player.model';
import {BracketData, Match} from '../../../shared/models/Bracket.model';
import {NavbarComponent} from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-check-match',
  imports: [
    ReactiveFormsModule,
    NavbarComponent
  ],
  templateUrl: './check-match.component.html',
  styleUrl: './check-match.component.css'
})
export class CheckMatchComponent {
  categories = ['ชายเดี่ยวทั่วไป', 'หญิงเดี่ยวทั่วไป', 'ชายเดี่ยว 40 ปี', 'หญิงเดี่ยว 40 ปี'];
  groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Group
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

  // Bracket
  mockBracketData = signal<{[key: string]: BracketData}>({
    'ชายเดี่ยวทั่วไป': {
      players: [
        'โครงมัจ', 'สมชาย', 'จิรายุ', 'พงษ์ศักดิ์',
        'อนุชิต', 'ธีรศักดิ์', 'วิชัย', 'สุรชัย',
        'ประวิทย์', 'อดิศร', 'กิตติ', 'รัชพล',
        'สมศักดิ์', 'วิทยา', 'นิรันดร์', 'ชัยวัฒน์'
      ],
      matches: [
        // round 8
        { id: 'r1-m1', player1: 'โครงมัจ', player2: 'สมชาย', score1: 2, score2: 0, winner: 'โครงมัจ', round: 1 },
        { id: 'r1-m2', player1: 'จิรายุ', player2: 'พงษ์ศักดิ์', score1: 1, score2: 2, winner: 'พงษ์ศักดิ์', round: 1 },
        { id: 'r1-m3', player1: 'อนุชิต', player2: 'ธีรศักดิ์', score1: 2, score2: 1, winner: 'อนุชิต', round: 1 },
        { id: 'r1-m4', player1: 'วิชัย', player2: 'สุรชัย', round: 1 },
        { id: 'r1-m5', player1: 'ประวิทย์', player2: 'อดิศร', round: 1 },
        { id: 'r1-m6', player1: 'กิตติ', player2: 'รัชพล', round: 1 },
        { id: 'r1-m7', player1: 'สมศักดิ์', player2: 'วิทยา', round: 1 },
        { id: 'r1-m8', player1: 'นิรันดร์', player2: 'ชัยวัฒน์', round: 1 },

        // round 4
        { id: 'r2-m1', player1: 'โครงมัจ', player2: 'พงษ์ศักดิ์', score1: 2, score2: 1, winner: 'โครงมัจ', round: 2 },
        { id: 'r2-m2', player1: 'อนุชิต', round: 2 },
        { id: 'r2-m3', round: 2 },
        { id: 'r2-m4', round: 2 },

        // round 2
        { id: 'r3-m1', player1: 'โครงมัจ', round: 3 },
        { id: 'r3-m2', round: 3 },

        // final
        { id: 'r4-m1', round: 4 }
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


  // Group
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

  // Bracket
  currentBracketData = computed(() => {
    if (this.selectedRound() !== 'bracket') return null;
    const key = this.selectedCategory();
    return this.mockBracketData()[key] || null;
  })

  hasData = computed(() => {
    if (this.selectedRound() === 'group') {
      return this.currentPlayers().length > 0;
    } else {
      return this.currentBracketData() !== null;
    }
  });

  formTitle = computed(() => {
    const category = this.selectedCategory();
    const round = this.selectedRound();

    if (round === 'group') {
      const group = this.selectedGroup();
      if (category && group) {
        return `${category} - สาย ${group}`;
      }
    } else if (round === 'bracket') {
      if (category) {
        return `${category} - รอบ 16 คนสุดท้าย`;
      }
    }
    return 'เลือกประเภทและรูปแบบการแข่งขัน';
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

  // Bracket
  getMatchesByRound(round: number): Match[] {
    const bracketData = this.currentBracketData();
    if (!bracketData) return [];
    return bracketData.matches.filter(match => match.round === round);
  }


}
