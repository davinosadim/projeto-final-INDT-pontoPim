import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeuPonto } from './meu-ponto';

describe('MeuPonto', () => {
  let component: MeuPonto;
  let fixture: ComponentFixture<MeuPonto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeuPonto],
    }).compileComponents();

    fixture = TestBed.createComponent(MeuPonto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
