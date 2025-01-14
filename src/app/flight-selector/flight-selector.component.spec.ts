import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSelectorComponent } from './flight-selector.component';

describe('FlightSelectorComponent', () => {
  let component: FlightSelectorComponent;
  let fixture: ComponentFixture<FlightSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightSelectorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FlightSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
