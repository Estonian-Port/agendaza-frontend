import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmEventoComponent } from './abm-evento.component';

describe('AbmEventoComponent', () => {
  let component: AbmEventoComponent;
  let fixture: ComponentFixture<AbmEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmEventoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
