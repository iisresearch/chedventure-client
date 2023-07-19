import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCreateDialogComponent } from './game-create-dialog.component';

describe('GameCreateDialogComponent', () => {
  let component: GameCreateDialogComponent;
  let fixture: ComponentFixture<GameCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameCreateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
