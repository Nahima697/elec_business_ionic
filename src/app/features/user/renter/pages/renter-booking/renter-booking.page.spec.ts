import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenterBookingPage } from './renter-booking.page';

describe('RenterBookingPage', () => {
  let component: RenterBookingPage;
  let fixture: ComponentFixture<RenterBookingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RenterBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
