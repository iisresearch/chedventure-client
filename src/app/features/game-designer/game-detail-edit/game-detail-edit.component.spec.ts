import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDetailEditComponent } from './game-detail-edit.component';

describe('GameDetailComponent', () => {
  let component: GameDetailEditComponent;
  let fixture: ComponentFixture<GameDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameDetailEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
