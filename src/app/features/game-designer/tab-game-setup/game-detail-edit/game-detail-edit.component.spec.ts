import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDetailEditComponent } from './game-detail-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {of} from "rxjs";
import {GameService} from "../../../../core/game.service";

describe('GameDetailComponent', () => {
  let component: GameDetailEditComponent;
  let fixture: ComponentFixture<GameDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],  // Include HttpClientTestingModule here
      declarations: [ GameDetailEditComponent ],
      providers: [ GameDetailEditComponent ]  // Make sure GameService is provided if not already
    }).compileComponents();

    fixture = TestBed.createComponent(GameDetailEditComponent);
    component = fixture.componentInstance;
    // Initialize FormGroup
    component.gameForm = new FormGroup({
      name: new FormControl('Form1', Validators.required),
      subtitle: new FormControl('Form2'),
      author: new FormControl('Form3', Validators.required),
      version: new FormControl('Form4', Validators.required)
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the value of the name control', () => {
    component.gameForm.controls['name'].setValue('New Name');
    expect(component.gameForm.controls['name'].value).toEqual('New Name');
  });

  it('should validate name as required', () => {
    component.gameForm.controls['name'].setValue('');
    expect(component.gameForm.controls['name'].valid).toBeFalsy();
  });

});
