import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbmDataTableHeaderComponent } from './abm-data-table-header.component';


describe('AbmHeaderComponent', () => {
  let component: AbmDataTableHeaderComponent;
  let fixture: ComponentFixture<AbmDataTableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmDataTableHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmDataTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
