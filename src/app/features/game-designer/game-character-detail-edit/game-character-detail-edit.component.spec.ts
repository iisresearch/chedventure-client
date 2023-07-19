import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCharacterDetailEditComponent } from './game-character-detail-edit.component';

describe('GameCharacterDetailEditComponent', () => {
  let component: GameCharacterDetailEditComponent;
  let fixture: ComponentFixture<GameCharacterDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameCharacterDetailEditComponent ]
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
