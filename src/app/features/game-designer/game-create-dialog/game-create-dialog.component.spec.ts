import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCreateDialogComponent } from './game-create-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef } from '@angular/material/dialog';

describe('GameCreateDialogComponent', () => {
  let component: GameCreateDialogComponent;
  let fixture: ComponentFixture<GameCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ GameCreateDialogComponent ],
        providers: [ { provide: MatDialogRef, useValue: {} } ]
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
