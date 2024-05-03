import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDialogueComponent } from './game-dialogue.component';

describe('GameDialogueComponent', () => {
  let component: GameDialogueComponent;
  let fixture: ComponentFixture<GameDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameDialogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
