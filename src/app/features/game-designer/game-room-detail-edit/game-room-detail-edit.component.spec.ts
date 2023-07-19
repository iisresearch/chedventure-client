import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomDetailEditComponent } from './game-room-detail-edit.component';

describe('GameRoomDetailEditComponent', () => {
  let component: GameRoomDetailEditComponent;
  let fixture: ComponentFixture<GameRoomDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameRoomDetailEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
