import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgMoringaSmartTableComponent } from './ng-moringa-table.component';

describe('NgMoringaSmartTableComponent', () => {
  let component: NgMoringaSmartTableComponent;
  let fixture: ComponentFixture<NgMoringaSmartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgMoringaSmartTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgMoringaSmartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
