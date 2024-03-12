import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureAnnotatorComponent } from './picture-annotator.component';

describe('PictureAnnotatorComponent', () => {
  let component: PictureAnnotatorComponent;
  let fixture: ComponentFixture<PictureAnnotatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PictureAnnotatorComponent]
    });
    fixture = TestBed.createComponent(PictureAnnotatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
