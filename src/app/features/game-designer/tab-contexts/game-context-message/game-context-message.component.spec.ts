import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameContextMessageComponent } from './game-context-message.component';

describe('GameContextMessageComponent', () => {
  let component: GameContextMessageComponent;
  let fixture: ComponentFixture<GameContextMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameContextMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameContextMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
