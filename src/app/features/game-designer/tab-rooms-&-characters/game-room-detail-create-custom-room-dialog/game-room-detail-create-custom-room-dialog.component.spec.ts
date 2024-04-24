import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomDetailCreateCustomRoomDialogComponent } from './game-room-detail-create-custom-room-dialog.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatDialogRef} from "@angular/material/dialog";

describe('GameRoomDetailCreateCustomRoomDialogComponent', () => {
  let component: GameRoomDetailCreateCustomRoomDialogComponent;
  let fixture: ComponentFixture<GameRoomDetailCreateCustomRoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ GameRoomDetailCreateCustomRoomDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameRoomDetailCreateCustomRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
