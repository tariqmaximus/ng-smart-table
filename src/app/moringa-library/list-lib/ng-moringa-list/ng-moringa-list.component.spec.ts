import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgMoringaListComponent } from './ng-moringa-list.component';

describe('NgMoringaListComponent', () => {
  let component: NgMoringaListComponent;
  let fixture: ComponentFixture<NgMoringaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgMoringaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgMoringaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
