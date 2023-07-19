import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomDetailCreateCustomRoomDialogComponent } from './game-room-detail-create-custom-room-dialog.component';

describe('GameRoomDetailCreateCustomRoomDialogComponent', () => {
  let component: GameRoomDetailCreateCustomRoomDialogComponent;
  let fixture: ComponentFixture<GameRoomDetailCreateCustomRoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameRoomDetailCreateCustomRoomDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomDetailCreateCustomRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
