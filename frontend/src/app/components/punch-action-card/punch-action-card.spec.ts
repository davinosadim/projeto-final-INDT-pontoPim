import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchActionCard } from './punch-action-card';

describe('PunchActionCard', () => {
  let component: PunchActionCard;
  let fixture: ComponentFixture<PunchActionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PunchActionCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PunchActionCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
