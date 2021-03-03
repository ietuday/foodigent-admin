import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMerchandiseComponent } from './add-edit-merchandise.component';

describe('AddEditMerchandiseComponent', () => {
  let component: AddEditMerchandiseComponent;
  let fixture: ComponentFixture<AddEditMerchandiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditMerchandiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditMerchandiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
