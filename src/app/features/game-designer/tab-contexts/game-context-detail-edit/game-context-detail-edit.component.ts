import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Character, Context, Game} from "../../../../core/models/game";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GameService} from "../../../../core/game.service";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-game-context-detail-edit',
  templateUrl: './game-context-detail-edit.component.html',
  styleUrl: './game-context-detail-edit.component.css'
})
export class GameContextDetailEditComponent implements OnInit, OnChanges {
  @Input() game!: Game;

  @Input() context!: Context;
  @Output() updatedContext = new EventEmitter<Context>();
  @Output() deletedContext = new EventEmitter<Context>();

  @Input() createNewContext!: boolean;

  @Input() characters!: Character[];

  contextForm: FormGroup = new FormGroup({});

  prompts:string[] = ['None', 'Utterance', 'Continuation'];

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.context && !this.createNewContext) {
      this.setupForm();
    } else {
      this.context = {
        id: -1,
        name: "",
        prompt: [],
        utterance: "",
        response: "",
      };
      this.setupForm();
    }
  }

  get name() { return this.contextForm.get('name') }
  get prompt() { return this.contextForm.get('prompt') }
  get utterance() { return this.contextForm.get('utterance') }
  get response() { return this.contextForm.get('response') }

  setupForm() {
    this.contextForm = new FormGroup({
      name: new FormControl(this.context.name, [Validators.required]),
      prompt: new FormControl(this.context.prompt),
      utterance: new FormControl(this.context.utterance),
      response: new FormControl(this.context.response),
    })
  }

  onSubmit() {
    if (this.contextForm.valid) {
      let contextToSend: Context = {
        id: this.context.id,
        name: this.name?.value,
        prompt: this.prompt?.value,
        utterance: this.utterance?.value,
        response: this.response?.value,
      }

      // If a new character is being created, send POST Request
      if (this.createNewContext) {
        this.gameService
          .createContext(this.game.id, contextToSend)
          .subscribe(context => {
            this.context = context;
            this.updatedContext.emit(this.context);
            console.log("ContextCreated " + contextToSend);
          })

      } else {
        // Send PUT request to update context to API
        this.gameService
          .updateContext(this.context.id, contextToSend)
          .subscribe(context => {
            this.context = context;
            this.updatedContext.emit(this.context);
            console.log("ContextUpdated " + contextToSend);
          })

      }
    }
  }

  deleteContext() {
    if (this.context?.id && !this.createNewContext) {
      if(confirm("Are you sure you want to delete this context?")) {
        this.gameService
          .deleteContext(this.context.id)
          .subscribe(result => {
            this.deletedContext.emit(this.context);
          })
      }
    }
  }

  onPromptChange($event: MatSelectChange) {
    if(this.prompt?.value!=="Utterance")
      this.utterance?.disable();
    else this.utterance?.enable()
  }
}
