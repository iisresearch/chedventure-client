import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCharacterDetailEditComponent } from './game-character-detail-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {GameService} from "../../../../core/game.service";

describe('GameCharacterDetailEditComponent', () => {
  let component: GameCharacterDetailEditComponent;
  let fixture: ComponentFixture<GameCharacterDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Include HttpClientTestingModule here
      declarations: [GameCharacterDetailEditComponent],
      providers: [GameService] // Provide the GameService if not provided globally
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCharacterDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
