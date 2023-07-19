import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayDemoAvatarComponent } from './play-demo-avatar.component';

describe('PlayComponent', () => {
  let component: PlayDemoAvatarComponent;
  let fixture: ComponentFixture<PlayDemoAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayDemoAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayDemoAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
