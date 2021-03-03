import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseDetailsComponent } from './merchandise-details.component';

describe('MerchandiseDetailsComponent', () => {
  let component: MerchandiseDetailsComponent;
  let fixture: ComponentFixture<MerchandiseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
