import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NGSmartTableComponent } from './ng-smart-table.component';

describe('NGSmartTableComponent', () => {
  let component: NGSmartTableComponent;
  let fixture: ComponentFixture<NGSmartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NGSmartTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NGSmartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
