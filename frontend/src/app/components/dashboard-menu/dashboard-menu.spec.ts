import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenu } from './dashboard-menu';

describe('DashboardMenu', () => {
  let component: DashboardMenu;
  let fixture: ComponentFixture<DashboardMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
