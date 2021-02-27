import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwentyteenpattiComponent } from './twentyteenpatti.component';

describe('TwentyteenpattiComponent', () => {
  let component: TwentyteenpattiComponent;
  let fixture: ComponentFixture<TwentyteenpattiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwentyteenpattiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwentyteenpattiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
