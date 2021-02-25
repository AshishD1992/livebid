import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AndarbaharComponent } from './andarbahar.component';

describe('AndarbaharComponent', () => {
  let component: AndarbaharComponent;
  let fixture: ComponentFixture<AndarbaharComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AndarbaharComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AndarbaharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
