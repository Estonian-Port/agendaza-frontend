import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarExtraComponent } from './seleccionar-extra.component';

describe('SeleccionarExtraComponent', () => {
  let component: SeleccionarExtraComponent;
  let fixture: ComponentFixture<SeleccionarExtraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeleccionarExtraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
