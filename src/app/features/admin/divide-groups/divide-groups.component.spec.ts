import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivideGroupsComponent } from './divide-groups.component';

describe('DivideGroupsComponent', () => {
  let component: DivideGroupsComponent;
  let fixture: ComponentFixture<DivideGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivideGroupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivideGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
