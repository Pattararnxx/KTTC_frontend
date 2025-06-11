import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MatchModel} from '../../models/Match.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private http = inject(HttpClient);

  getMatches(filters: { category?: string; group?: string; round?: string }): Observable<MatchModel[]> {
    let params = new HttpParams();
    if (filters.category) params = params.set('category', filters.category);
    if (filters.group) params = params.set('group', filters.group);
    if (filters.round) params = params.set('round', filters.round);

    return this.http.get<MatchModel[]>('http://localhost:3000/users/matches', { params });
  }

  updateMatchScore(matchId: number, data: {
    player1_score: number;
    player2_score: number;
    winner_id: number;
    status: string;
  }) {
    return this.http.patch(`http://localhost:3000/users/matches/${matchId}/score`, data);
  }
}
