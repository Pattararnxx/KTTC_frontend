import {Component, inject, signal} from '@angular/core';
import {SidebarComponent} from '../../../components/sidebar/sidebar.component';
import {Registration} from '../../../shared/models/Registration.model';
import {GroupsService} from '../../../shared/services/groups/groups.service';
import {NgIf} from '@angular/common';

type Group = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
const GROUPS: Group[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

@Component({
  selector: 'app-divide-groups',
  imports: [
    SidebarComponent,
    NgIf
  ],
  templateUrl: './divide-groups.component.html',
  styleUrl: './divide-groups.component.css'
})
export class DivideGroupsComponent {
  groupsSaved = signal(false);
  private groupsService = inject(GroupsService);

  readonly GROUPS = GROUPS;

  availablePlayers = signal<Registration[]>([]);
  groupedResults = signal<Record<string, Record<Group, Registration[]>>>({});
  knockoutSeeds = signal<Record<string, Registration[]>>({});
  existingGroups = signal<Record<string, Record<string, Registration[]>>>({});

  loading = signal(false);
  saving = signal(false);

  constructor() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);

    this.groupsService.getAvailableForGrouping().subscribe({
      next: (players) => {
        this.availablePlayers.set(players);
        this.loading.set(false);
      },
      error: () => {
        this.availablePlayers.set([]);
        this.loading.set(false);
      }
    });

    this.groupsService.getGroupedPlayers().subscribe({
      next: (groups) => {
        this.existingGroups.set(groups);
        if (Object.keys(groups).length > 0) {
          this.groupsSaved.set(true);
          this.groupedResults.set(groups as any);

          const knockout: Record<string, Registration[]> = {};
          Object.keys(groups).forEach(category => {
            knockout[category] = [];
            Object.values(groups[category]).forEach((players: Registration[]) => {
              players.forEach(player => {
                if (player.seed_rank !== undefined && player.seed_rank !== null && player.seed_rank !== '-') {
                  knockout[category].push(player);
                }
              });
            });
          });
          this.knockoutSeeds.set(knockout);

        } else {
          this.groupsSaved.set(false);
          this.groupedResults.set({});
        }
      },
      error: () => {
        console.error('Failed to load grouped players');
      }
    });
  }

  drawGroups(){
    this.groupsSaved.set(false);
    const all = this.availablePlayers().filter(p => p.is_paid);
    const categories = Array.from(new Set(all.map(p => p.category)));

    const results: Record<string, Record<Group, Registration[]>> = {};
    const knockout: Record<string, Registration[]> = {};

    for (const category of categories) {
      const players = all.filter(p => p.category === category);
      const seeded = players.filter(p => p.seed_rank !== '-' && p.seed_rank !== null);
      const unseeded = players.filter(p => p.seed_rank === '-' || p.seed_rank === null);

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

  saveGroups() {
    const assignments: { userId: number; groupName: string }[] = [];
    const results = this.groupedResults();

    Object.values(results).forEach(categoryGroups => {
      Object.entries(categoryGroups).forEach(([groupName, players]) => {
        players.forEach(player => {
          assignments.push({
            userId: player.id,
            groupName: groupName
          });
        });
      });
    });

    if (assignments.length === 0) {
      alert('ไม่มีการแบ่งกลุ่มให้บันทึก');
      return;
    }

    this.saving.set(true);
    this.groupsService.assignGroups(assignments).subscribe({
      next: () => {
        this.saving.set(false);
        alert('บันทึกการแบ่งกลุ่มสำเร็จ');
        this.groupsSaved.set(true);
        this.loadData();
      },
      error: () => {
        this.saving.set(false);
        alert('เกิดข้อผิดพลาดในการบันทึก');
      }
    });
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

  createMatches() {
    if (!this.groupsSaved()) {
      alert('กรุณาบันทึกการแบ่งกลุ่มก่อน');
      return;
    }

    if (confirm('ต้องการสร้างการจับคู่แมตช์หรือไม่?')) {
      this.saving.set(true);

      this.groupsService.createTournamentMatches().subscribe({
        next: () => {
          this.saving.set(false);
          alert('สร้างการจับคู่แมตช์สำเร็จ!');
        },
        error: () => {
          this.saving.set(false);
          alert('เกิดข้อผิดพลาดในการสร้างการจับคู่แมตช์');
        }
      });
    }
  }
}
