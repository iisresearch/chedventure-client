import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomDetailComponent } from './game-room-detail.component';

describe('GameRoomDetailComponent', () => {
  let component: GameRoomDetailComponent;
  let fixture: ComponentFixture<GameRoomDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameRoomDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
