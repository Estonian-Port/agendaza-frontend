import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAgendaComponent } from './card-agenda.component';

describe('CardAgendaComponent', () => {
  let component: CardAgendaComponent;
  let fixture: ComponentFixture<CardAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardAgendaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
