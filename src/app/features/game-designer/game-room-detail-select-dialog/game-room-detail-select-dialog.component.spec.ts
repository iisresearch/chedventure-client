import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomDetailSelectDialogComponent } from './game-room-detail-select-dialog.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

describe('GameRoomDetailSelectDialogComponent', () => {
  let component: GameRoomDetailSelectDialogComponent;
  let fixture: ComponentFixture<GameRoomDetailSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ GameRoomDetailSelectDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },  // Mock MatDialogRef with an empty object
          // example for close method: useValue: {close: jasmine.createSpy('close') }
        { provide: MAT_DIALOG_DATA, useValue: {} } // Optionally mock MAT_DIALOG_DATA if your component uses it ]
      ]
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
