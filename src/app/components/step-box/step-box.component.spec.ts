import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepBoxComponent } from './step-box.component';

describe('StepBoxComponent', () => {
  let component: StepBoxComponent;
  let fixture: ComponentFixture<StepBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
