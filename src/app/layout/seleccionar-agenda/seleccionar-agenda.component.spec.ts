import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarAgendaComponent } from './seleccionar-agenda.component';

describe('SeleccionarAgendaComponent', () => {
  let component: SeleccionarAgendaComponent;
  let fixture: ComponentFixture<SeleccionarAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeleccionarAgendaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
