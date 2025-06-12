import {Component, signal, inject, effect} from '@angular/core';
import {SidebarComponent} from '../../../components/sidebar/sidebar.component';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {MatchService} from '../../../shared/services/match/match.service';
import {MatchModel} from '../../../shared/models/Match.model';

const BRACKET_ROUNDS_ORDER = ['round16', 'quarter', 'semi', 'final'] as const;
type BracketRound = typeof BRACKET_ROUNDS_ORDER[number];
type TournamentRound = 'group' | BracketRound;

@Component({
  selector: 'app-group-results',
  standalone: true,
  imports: [
    SidebarComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './group-results.component.html',
  styleUrl: './group-results.component.css'
})
export class GroupResultsComponent {
  categories = ['ชายเดี่ยวทั่วไป', 'หญิงเดี่ยวทั่วไป', 'ชายเดี่ยวอายุไม่ต่ำกว่า 40 ปี', 'หญิงเดี่ยวอายุไม่ต่ำกว่า 40 ปี'];
  groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  private matchService = inject(MatchService);
  isSubmitting = false;

  fg = new FormGroup({
    category: new FormControl(''),
    group: new FormControl(''),
    round: new FormControl('group'),
  })

  category = signal('');
  group = signal('');
  round = signal<'group' | 'bracket'>('group');
  currentManagedRound = signal<TournamentRound>('group');

  matches = signal<MatchModel[]>([]);
  scores = signal<{ score1: string; score2: string }[]>([]);

  constructor() {
    this.fg.valueChanges.subscribe(values => {
      this.category.set(values.category || '');
      this.group.set(values.group || '');

      if (values.round === 'bracket') {
        this.currentManagedRound.set('round16');
      } else {
        this.currentManagedRound.set('group');
      }
    });
    effect(() => {
      this.loadMatches();
    });

    effect(() => {
      const currentMatches = this.matches();
      this.scores.set(currentMatches.map(m => ({
        score1: m.player1_score?.toString() ?? '',
        score2: m.player2_score?.toString() ?? ''
      })));
    });

    this.loadMatches();
  }

  private loadMatches(): void {
    const category = this.category();
    const group = this.group();
    const roundToLoad = this.currentManagedRound();

    if (!category) {
      this.matches.set([]);
      return;
    }

    const filters: any = { category };
    if (roundToLoad === 'group') {
      if (!group) {
        this.matches.set([]);
        return;
      }
      filters.groupName = group;
      filters.round = 'group';
    }else {
      filters.round = roundToLoad;
    }

    this.matchService.getMatches(filters).subscribe(matches => {
      console.log('ได้ matches:', matches);
      this.matches.set(matches.filter(m => m.status !== 'completed'));
    });
  }

  private getNextBracketRound(currentRound: BracketRound): BracketRound | null {
    const currentIndex = BRACKET_ROUNDS_ORDER.indexOf(currentRound);
    if (currentIndex !== -1 && currentIndex < BRACKET_ROUNDS_ORDER.length - 1) {
      return BRACKET_ROUNDS_ORDER[currentIndex + 1];
    }
    return null;
  }

  handleScoreInput(index: number, key: 'score1' | 'score2', event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const currentScores = [...this.scores()];
      if (currentScores[index]) {
        currentScores[index] = { ...currentScores[index], [key]: target.value };
        this.scores.set(currentScores);
      }
    }
  }

  async submit(): Promise<void> {
    this.isSubmitting = true;
    const matches = this.matches();
    let hasUpdatedAnyMatch = false;
    const categoryValue = this.category();
    const currentRoundValue = this.currentManagedRound();

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const scoreEntry = this.scores()[i];

      const score1 = scoreEntry.score1?.trim();
      const score2 = scoreEntry.score2?.trim();

      if (!score1 || !score2) continue;

      try {
        const player1_score = parseInt(score1, 10);
        const player2_score = parseInt(score2, 10);

        if (isNaN(player1_score) || isNaN(player2_score)|| player1_score === player2_score) continue;

        const winner_id = player1_score > player2_score ?
          match.player1_id! : match.player2_id!;

        await firstValueFrom(
          this.matchService.updateMatchScore(match.id, {
            player1_score,
            player2_score,
            winner_id,
            status: 'completed'
          })
        );
        hasUpdatedAnyMatch = true;
      }  catch (error) {
        console.error('Error:', error);
      }

    }
    if (hasUpdatedAnyMatch) {
      try {
        if (categoryValue && currentRoundValue === 'group') {
          const bracketResult = await firstValueFrom(
            this.matchService.generateBracket(categoryValue)
          );

          if (bracketResult.generated) {
            alert('บันทึกผลสำเร็จ! รอบ Bracket ถูกสร้างอัตโนมัติแล้ว');
            this.currentManagedRound.set('round16');
          } else {
            alert('บันทึกผลสำเร็จ!');
            this.loadMatches();
          }
        }else if (categoryValue && BRACKET_ROUNDS_ORDER.includes(currentRoundValue as BracketRound)) {
          const allMatchesForCurrentBracketRound = await firstValueFrom(
            this.matchService.getMatches({ category: categoryValue, round: currentRoundValue })
          );
          const allCurrentRoundCompleted = allMatchesForCurrentBracketRound.every(m => m.status === 'completed');

          if (allCurrentRoundCompleted) {
            const nextRound = this.getNextBracketRound(currentRoundValue as BracketRound);
            if (nextRound) {
              alert(`บันทึกผล ${this.currentRoundDisplayName} สำเร็จ! กำลังไปยังรอบ ${this.getRoundDisplayName(nextRound)}`);
              this.currentManagedRound.set(nextRound);
            } else {
              alert(`บันทึกผล ${this.currentRoundDisplayName} สำเร็จ! การแข่งขันสิ้นสุดแล้ว`);
              this.loadMatches();
            }
          } else {
            alert(`บันทึกผล ${this.currentRoundDisplayName} สำเร็จ!`);
            this.loadMatches();
          }
        } else {
          alert('บันทึกผลสำเร็จ! (แต่ไม่สามารถระบุขั้นตอนถัดไปได้)');
          this.loadMatches();
        }
      } catch (error) {
        console.error('Error checking bracket:', error);
        alert('บันทึกผลสำเร็จ!');
        this.loadMatches();
      }
    } else {
      this.loadMatches();
    }
    this.isSubmitting = false;
  }

  get currentRoundDisplayName(): string {
    return this.getRoundDisplayName(this.currentManagedRound());
  }

  getRoundDisplayName(round: TournamentRound): string {
    if (round === 'group') return `กลุ่ม ${this.group() || '(ยังไม่ได้เลือกกลุ่ม)'}`;
    if (round === 'round16') return 'รอบ 16 คน';
    if (round === 'quarter') return 'รอบก่อนรองชนะเลิศ (8 คน)';
    if (round === 'semi') return 'รอบรองชนะเลิศ (4 คน)';
    if (round === 'final') return 'รอบชิงชนะเลิศ';
    return 'ไม่ระบุรอบ';
  }

  getPlayerName(player: any): string {
    if (!player) {
      return 'TBD';
    }

    if (player.firstname && player.lastname) {
      return `${player.firstname} ${player.lastname}`;
    }

    return 'ไม่ระบุชื่อ';
  }
}
