import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetDetailsComponent } from './dataset-details.component';

describe('DatasetDetailsComponent', () => {
  let component: DatasetDetailsComponent;
  let fixture: ComponentFixture<DatasetDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetDetailsComponent]
    });
    fixture = TestBed.createComponent(DatasetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
