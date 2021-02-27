import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreecardjudgeComponent } from './threecardjudge.component';

describe('ThreecardjudgeComponent', () => {
  let component: ThreecardjudgeComponent;
  let fixture: ComponentFixture<ThreecardjudgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreecardjudgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreecardjudgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
