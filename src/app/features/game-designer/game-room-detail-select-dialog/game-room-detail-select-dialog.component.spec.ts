import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomDetailSelectDialogComponent } from './game-room-detail-select-dialog.component';

describe('GameRoomDetailSelectDialogComponent', () => {
  let component: GameRoomDetailSelectDialogComponent;
  let fixture: ComponentFixture<GameRoomDetailSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameRoomDetailSelectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomDetailSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
