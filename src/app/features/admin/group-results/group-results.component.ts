import {Component, signal, inject, effect} from '@angular/core';
import {SidebarComponent} from '../../../components/sidebar/sidebar.component';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {firstValueFrom} from 'rxjs';
import {MatchService} from '../../../shared/services/match/match.service';
import {MatchModel} from '../../../shared/models/Match.model';

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
  categories = ['ชายเดี่ยวทั่วไป', 'หญิงเดี่ยวทั่วไป', 'ชายเดี่ยว 40 ปี', 'หญิงเดี่ยว 40 ปี'];
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

  matches = signal<MatchModel[]>([]);
  scores = signal<{ score1: string; score2: string }[]>([]);

  constructor() {
    this.fg.valueChanges.subscribe(values => {
      this.category.set(values.category || '');
      this.group.set(values.group || '');
      this.round.set(values.round === 'bracket' ? 'bracket' : 'group');
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
    const round = this.round();

    console.log('Loading matches:', { category, group, round });

    if (!category || !group) {
      this.matches.set([]);
      return;
    }

    this.matchService.getMatches({
      category,
      group,
      round
    }).subscribe(matches => {
      const incompleteMatches = matches.filter(m => m.status !== 'completed');
      this.matches.set(incompleteMatches);
    });
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

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const scoreEntry = this.scores()[i];

      const score1 = scoreEntry.score1?.trim();
      const score2 = scoreEntry.score2?.trim();

      if (!score1 || !score2) continue;

      try {
        const player1_score = parseInt(score1, 10);
        const player2_score = parseInt(score2, 10);

        if (isNaN(player1_score) || isNaN(player2_score)) continue;

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
      }  catch (error) {
        console.error('Error:', error);
      }

    }
    this.loadMatches();
    this.isSubmitting = false;
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
