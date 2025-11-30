import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifMethodPage } from './verif-method.page';

describe('VerifMethodPage', () => {
  let component: VerifMethodPage;
  let fixture: ComponentFixture<VerifMethodPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifMethodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
