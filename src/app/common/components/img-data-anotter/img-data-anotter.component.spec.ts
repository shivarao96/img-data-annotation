import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImgDataAnotterComponent } from './img-data-anotter.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ImgDataAnotterComponent', () => {
  let component: ImgDataAnotterComponent;
  let fixture: ComponentFixture<ImgDataAnotterComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ 
        ImgDataAnotterComponent 
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgDataAnotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
