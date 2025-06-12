import {Component, computed, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Player} from '../../../shared/models/Player.model';
import {NavbarComponent} from '../../../components/navbar/navbar.component';
import {MatchService} from '../../../shared/services/match/match.service';
import {MatchModel} from '../../../shared/models/Match.model';
type BracketRound = 'group' | 'round16' | 'quarter' | 'semi' | 'final';

const ROUND_ORDER: Record<BracketRound, number> = {
  group: 0,
  round16: 1,
  quarter: 2,
  semi: 3,
  final: 4
};

function isBracketRound(value: any): value is BracketRound {
  return typeof value === 'string' && (value in ROUND_ORDER);
}

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

  private matchService = inject(MatchService);

  fg = new FormGroup({
    category: new FormControl(''),
    group: new FormControl(''),
    round: new FormControl('group'),
  })

  selectedCategory = signal<string>('');
  selectedGroup = signal<string>('');
  selectedRound = signal<string>('group');

  matches = signal<MatchModel[]>([]);
  loading = signal<boolean>(false);
  error = signal<string>('');

  constructor() {
    this.fg.valueChanges.subscribe(values => {
      console.log('Form values changed:', values);

      this.selectedCategory.set(values.category || '');
      this.selectedGroup.set(values.group || '');
      this.selectedRound.set(values.round || 'group');

      if (values.category) {
        this.loadMatches();
      }
    });
  }

  private loadMatches(): void {
    const category = this.selectedCategory();
    const group = this.selectedGroup();
    const round = this.selectedRound();

    if (!category) {
      this.matches.set([]);
      return;
    }

    if (round === 'group' && !group) {
      this.matches.set([]);
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const filters: any = { category };

    if (round === 'group' && group) {
      filters.round = 'group';
      filters.groupName = group;
    } else if (round === 'bracket') {
      filters.round = ['round16', 'quarter', 'semi', 'final'];
    } else {
      filters.round = round;
    }

    this.matchService.getMatches(filters).subscribe({
      next: (matches) => {
        console.log('Loaded matches:', matches);
        this.matches.set(matches);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading matches:', err);
        this.error.set('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        this.matches.set([]);
        this.loading.set(false);
      }
    });
  }

  groupPlayers = computed(() => {
    const currentMatches = this.matches();
    const round = this.selectedRound();

    if (round !== 'group' || !currentMatches.length) return [];

    const playersMap = new Map<number, Player>();

    currentMatches.forEach(match => {
      if (match.player1) {
        playersMap.set(match.player1.id, {
          id: match.player1.id,
          name: `${match.player1.firstname}`,
          points: 0
        });
      }
      if (match.player2) {
        playersMap.set(match.player2.id, {
          id: match.player2.id,
          name: `${match.player2.firstname}`,
          points: 0
        });
      }
    });

    currentMatches.forEach(match => {
      if (match.status === 'completed' && match.winner_id) {
        const winner = playersMap.get(match.winner_id);
        if (winner) {
          winner.points += 2;
        }

        const loserId = match.winner_id === match.player1_id ? match.player2_id : match.player1_id;
        const loser = playersMap.get(loserId!);

        if (
          loser &&
          ((match.player1_score === 2 && match.player2_score === 1) ||
            (match.player1_score === 1 && match.player2_score === 2))
        ) {
          loser.points += 1;
        }
      }
    });

    return Array.from(playersMap.values()).sort((a, b) => b.points - a.points);
  });

  resultsMatrix = computed(() => {
    const players = this.groupPlayers();
    const currentMatches = this.matches();

    if (!players.length) return [];

    const matrix: (string | null)[][] = [];

    players.forEach((player, i) => {
      matrix[i] = [];
      players.forEach((opponent, j) => {
        if (i === j) {
          matrix[i][j] = '-';
        } else {
          const match = currentMatches.find(m =>
            (m.player1_id === player.id && m.player2_id === opponent.id) ||
            (m.player1_id === opponent.id && m.player2_id === player.id)
          );

          if (match && match.status === 'completed') {
            if (match.player1_id === player.id) {
              matrix[i][j] = `${match.player1_score || 0}-${match.player2_score || 0}`;
            } else {
              matrix[i][j] = `${match.player2_score || 0}-${match.player1_score || 0}`;
            }
          } else {
            matrix[i][j] = null;
          }
        }
      });
    });

    return matrix;
  });


  bracketMatches = computed(() => {
    const currentMatches = this.matches();
    const selectedRd = this.selectedRound();

    if (selectedRd !== 'bracket') return [];

    return currentMatches
      .filter(match => match.round && match.round !== 'group')
      .sort((a, b) => {
      let aOrder = 999;
        if (a.round && isBracketRound(a.round)) {
          aOrder = ROUND_ORDER[a.round as BracketRound];
        } else if (a.round !== undefined && a.round !== 'group') {
          console.warn(`Invalid bracket_round value for match ${a.id}: ${a.round}`);
        }
      let bOrder = 999;
        if (b.round && isBracketRound(b.round)) {
          bOrder = ROUND_ORDER[b.round as BracketRound];
        } else if (b.round !== undefined && b.round !== 'group') {
          console.warn(`Invalid bracket_round value for match ${b.id}: ${b.round}`);
        }

      if (aOrder === bOrder) {
        return (a.match_order ?? a.id ?? 0) - (b.match_order ?? b.id ?? 0);
      }

      return aOrder - bOrder;
    });
  });

  getMatchesByRound(round: BracketRound): MatchModel[] {
    const allBracketMatches = this.bracketMatches();

    return allBracketMatches.filter(match => match.round === round);
  }

  hasData = computed(() => {
    return this.matches().length > 0;
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

  getMatchResult(playerIndex: number, opponentIndex: number): string {
    const results = this.resultsMatrix();

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
  currentPlayers = computed(() => {
    if (this.selectedRound() === 'group') {
      return this.groupPlayers();
    }
    return [];
  });

}
