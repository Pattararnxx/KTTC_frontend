import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupResultsComponent } from './group-results.component';

describe('GroupResultsComponent', () => {
  let component: GroupResultsComponent;
  let fixture: ComponentFixture<GroupResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
