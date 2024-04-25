import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameContextDetailComponent } from './game-context-detail.component';

describe('GameContextDetailComponent', () => {
  let component: GameContextDetailComponent;
  let fixture: ComponentFixture<GameContextDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameContextDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameContextDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
