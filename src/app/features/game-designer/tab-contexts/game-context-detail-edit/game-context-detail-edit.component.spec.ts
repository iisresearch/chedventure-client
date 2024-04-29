import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameContextDetailEditComponent } from './game-context-detail-edit.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('GameContextDetailEditComponent', () => {
  let component: GameContextDetailEditComponent;
  let fixture: ComponentFixture<GameContextDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameContextDetailEditComponent],
      imports: [HttpClientTestingModule], // Include HttpClientTestingModule here
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
