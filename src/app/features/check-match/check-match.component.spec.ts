import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckMatchComponent } from './check-match.component';

describe('CheckMatchComponent', () => {
  let component: CheckMatchComponent;
  let fixture: ComponentFixture<CheckMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
