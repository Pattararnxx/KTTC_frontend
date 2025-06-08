import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Registration} from '../../models/Registration.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private http = inject(HttpClient);

  getAvailableForGrouping(): Observable<Registration[]> {
    return this.http.get<Registration[]>(`http://localhost:3000/users/groups/available`);
  }

  getGroupedPlayers(): Observable<Record<string, Record<string, Registration[]>>> {
    return this.http.get<Record<string, Record<string, Registration[]>>>(`http://localhost:3000/users/groups`);
  }

  assignGroups(assignments: { userId: number; groupName: string }[]): Observable<any> {
    return this.http.post(`http://localhost:3000/users/groups/assign`, { assignments });
  }

}
