import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmDataTableComponent } from './abm-data-table.component';

describe('AbmDataTableComponent', () => {
  let component: AbmDataTableComponent;
  let fixture: ComponentFixture<AbmDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
