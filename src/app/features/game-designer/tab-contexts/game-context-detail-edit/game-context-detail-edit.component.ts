import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Context, Game} from "../../../../core/models/game";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-game-context-detail-edit',
  templateUrl: './game-context-detail-edit.component.html',
  styleUrl: './game-context-detail-edit.component.css'
})
export class GameContextDetailEditComponent implements OnInit {
  @Input() game!: Game;

  @Input() context!: Context;
  @Output() updatedContext = new EventEmitter<Context>();
  @Output() deletedContext = new EventEmitter<Context>();

  @Input() createNewContext!: boolean;

  contextForm: FormGroup = new FormGroup({
    context: new FormControl("", [Validators.required]),
    prompt: new FormControl(""),
    utterance: new FormControl(""),
    response: new FormControl(""),

    useDummyChatbot: new FormControl(true),
    chatbotUrl: new FormControl("", [Validators.required]),
  })

  constructor() { }

  ngOnInit(): void {
  }

}
