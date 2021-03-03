import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonWarningComponent } from './common-warning.component';

describe('CommonWarningComponent', () => {
  let component: CommonWarningComponent;
  let fixture: ComponentFixture<CommonWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonWarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
