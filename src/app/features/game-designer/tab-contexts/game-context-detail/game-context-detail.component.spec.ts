import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameContextDetailComponent } from './game-context-detail.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {GameService} from "../../../../core/game.service";
import {Game} from "../../../../core/models/game";
import {of} from "rxjs";


describe('GameContextDetailComponent', () => {
  let component: GameContextDetailComponent;
  let fixture: ComponentFixture<GameContextDetailComponent>;
  let game: Game = jasmine.createSpyObj('game', [], {
    id: 1, name: 'game1', author: 'author1', description: 'description1', created: new Date(), updated: new Date(), contexts: []
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [ GameContextDetailComponent ],
      providers: [
        //{provide: GameService, useClass: GameService},
        {provide: Game, useValue: game},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameContextDetailComponent);
    component = fixture.componentInstance;

    component.game = game;

    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });
});
