import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDetailEditFinalConfigurationComponent } from './game-detail-edit-final-configuration.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {GameService} from "../../../../core/game.service";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";

describe('GameDetailEditFinalConfigurationComponent', () => {
  let component: GameDetailEditFinalConfigurationComponent;
  let fixture: ComponentFixture<GameDetailEditFinalConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Include HttpClientTestingModule here
      declarations: [GameDetailEditFinalConfigurationComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({id: '123'}) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameDetailEditFinalConfigurationComponent);
    component = fixture.componentInstance;
    component.game = {id: '123', name: 'Dummy Game', author: 'Author', isPublished: false, version: 'test 1.0'};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
