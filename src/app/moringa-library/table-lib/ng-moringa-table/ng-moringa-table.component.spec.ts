import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgMoringaTableComponent } from './ng-moringa-table.component';

describe('NgMoringaTableComponent', () => {
  let component: NgMoringaTableComponent;
  let fixture: ComponentFixture<NgMoringaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgMoringaTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgMoringaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
