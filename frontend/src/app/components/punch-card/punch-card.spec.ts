import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchCard } from './punch-card';

describe('PunchCard', () => {
  let component: PunchCard;
  let fixture: ComponentFixture<PunchCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PunchCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PunchCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
