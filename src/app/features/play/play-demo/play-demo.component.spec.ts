import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayDemoComponent } from './play-demo.component';

describe('PlayDemoComponent', () => {
  let component: PlayDemoComponent;
  let fixture: ComponentFixture<PlayDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayDemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
