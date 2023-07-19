import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDetailEditFinalConfigurationComponent } from './game-detail-edit-final-configuration.component';

describe('GameDetailEditFinalConfigurationComponent', () => {
  let component: GameDetailEditFinalConfigurationComponent;
  let fixture: ComponentFixture<GameDetailEditFinalConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameDetailEditFinalConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDetailEditFinalConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
