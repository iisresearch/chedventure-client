import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameContextDetailEditComponent } from './game-context-detail-edit.component';

describe('GameContextDetailEditComponent', () => {
  let component: GameContextDetailEditComponent;
  let fixture: ComponentFixture<GameContextDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameContextDetailEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameContextDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
