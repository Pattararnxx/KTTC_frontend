import {Component, computed, effect, signal,  OnInit, OnDestroy} from '@angular/core';
import {SidebarComponent} from '../../../components/sidebar/sidebar.component';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';

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
export class GroupResultsComponent implements OnInit, OnDestroy  {
  categories = ['ชายเดี่ยวทั่วไป', 'หญิงเดี่ยวทั่วไป', 'ชายเดี่ยว 40 ปี', 'หญิงเดี่ยว 40 ปี'];
  groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  fg = new FormGroup({
    category: new FormControl(''),
    group: new FormControl(''),
    round: new FormControl('group'),
  })

  category = signal('');
  group = signal('');
  round = signal<'group' | 'bracket'>('group');

  allMatches = [
    { category: 'ชายเดี่ยวทั่วไป', group: 'A', round: 'group', team1: 'Player A1', team2: 'Player A2' },
    { category: 'ชายเดี่ยวทั่วไป', group: 'A', round: 'bracket', team1: 'Player A1', team2: 'Player B1' },
    { category: 'หญิงเดี่ยวทั่วไป', group: 'B', round: 'group', team1: 'Player B1', team2: 'Player B2' },
    { category: 'ชายเดี่ยวทั่วไป', group: 'A', round: 'group' , team1: 'Player A3', team2: 'Player A4' },
    { category: 'หญิงเดี่ยวทั่วไป', group: 'A', round: 'group' , team1: 'Player W1', team2: 'Player W2' },
  ];

  filteredMatches = computed(() => {
    const currentCategory = this.category();
    const currentGroup = this.group();
    const currentRound = this.round();

    return this.allMatches.filter(m => {
      const categoryMatch = m.category === currentCategory;
      const roundMatch = m.round === currentRound;

      if (currentRound === 'bracket') {
        return categoryMatch && roundMatch;
      } else {
        return categoryMatch && m.group === currentGroup && roundMatch;
      }
    });
  });

  scores = signal<{ score1: string; score2: string }[]>([]);

  private formSubscription: Subscription | undefined;

  constructor() {
    effect(() => {
      const newScores = this.filteredMatches().map(() => ({ score1: '', score2: '' }));
      this.scores.set(newScores);
    });
  }

  ngOnInit(): void {
    this.updateSignalsFromForm(this.fg.value);

    this.formSubscription = this.fg.valueChanges.subscribe(values => {
      this.updateSignalsFromForm(values);
    });
  }

  private updateSignalsFromForm(values: any): void {
    this.category.set(values.category || '');
    this.group.set(values.group || '');

    const roundValue = values.round as 'group' | 'bracket';
    if (roundValue === 'group' || roundValue === 'bracket') {
      this.round.set(roundValue);
    } else {
      this.round.set('group');
    }
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  handleScoreInput(index: number, key: 'score1' | 'score2', event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (target) {
      this.updateScore(index, key, target.value);
    }
  }

  updateScore(index: number, key: 'score1' | 'score2', value: string): void {
    const currentScores = this.scores();
    if (currentScores && currentScores[index] !== undefined) {
      const newScoresArray = [...currentScores];
      newScoresArray[index] = {
        ...newScoresArray[index],
        [key]: value
      };
      this.scores.set(newScoresArray);
    } else {
      console.warn(`Scores array or scores at index ${index} is not initialized or out of bounds.`);
    }
  }

  submit(): void {
    const result = this.filteredMatches().map((match, i) => {
      const scoreEntry = this.scores()[i];
      return {
        match,
        score: scoreEntry ? scoreEntry : { score1: '', score2: '' }
      };
    });
    console.log('ผลที่บันทึก:', result);
  }


}
