import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomDetailCanvasComponent } from './game-room-detail-canvas.component';

describe('GameRoomDetailCanvasComponent', () => {
  let component: GameRoomDetailCanvasComponent;
  let fixture: ComponentFixture<GameRoomDetailCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameRoomDetailCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomDetailCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
