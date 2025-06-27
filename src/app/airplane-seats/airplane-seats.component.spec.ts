import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirplaneSeatsComponent } from './airplane-seats.component';

describe('AirplaneSeatsComponent', () => {
  let component: AirplaneSeatsComponent;
  let fixture: ComponentFixture<AirplaneSeatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirplaneSeatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirplaneSeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
