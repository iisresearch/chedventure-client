import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomDetailEditComponent } from './game-room-detail-edit.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";


describe('GameRoomDetailEditComponent', () => {
  let component: GameRoomDetailEditComponent;
  let fixture: ComponentFixture<GameRoomDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],  // Include HttpClientTestingModule here
      declarations: [ GameRoomDetailEditComponent ],
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
