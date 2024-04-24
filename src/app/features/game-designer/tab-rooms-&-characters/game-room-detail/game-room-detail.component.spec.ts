import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomDetailComponent } from './game-room-detail.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('GameRoomDetailComponent', () => {
  let component: GameRoomDetailComponent;
  let fixture: ComponentFixture<GameRoomDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ GameRoomDetailComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameRoomDetailComponent);
    component = fixture.componentInstance;
    component.game = {id: '123', name: 'Dummy Game', author: 'Author', isPublished: false, version: 'test 1.0'};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
