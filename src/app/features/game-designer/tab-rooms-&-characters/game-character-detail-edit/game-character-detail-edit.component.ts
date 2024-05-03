import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {Character, Game} from "../../../../core/models/game";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GameService} from "../../../../core/game.service";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-game-character-detail-edit',
  templateUrl: './game-character-detail-edit.component.html',
  styleUrls: ['./game-character-detail-edit.component.css']
})
export class GameCharacterDetailEditComponent implements OnInit {
  @Input() game!: Game;

  @Input() character!: Character;
  @Output() updatedCharacter = new EventEmitter<Character>();
  @Output() deletedCharacter = new EventEmitter<Character>();

  @Input() createNewCharacter!: boolean;

  disabled = true;

  readonly DUMMY_CHATBOT = "https://creator.voiceflow.com/prototype/626abdde3e2ab5c39626f392";

  characterForm: FormGroup = new FormGroup({
    // name: new FormControl("", [Validators.required]),
    // description: new FormControl(""),
    // title: new FormControl(""),
    // history: new FormControl(""),
    // context: new FormControl(""),
    // prompt: new FormControl(""),
    // utterance: new FormControl(""),
    // response: new FormControl(""),
    //
    // useDummyChatbot: new FormControl(true),
    // chatbotUrl: new FormControl("", [Validators.required]),
  })

  // Dummy prompt example
  prompts:string[] = ['None', 'Utterance', 'Continuation'];

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.character && !this.createNewCharacter) {
      this.setupForm();
    } else {
      let ch: Character = {
        id: -1,
        name: "",
        description: "",
        title: "",
        chatbotUrl: this.DUMMY_CHATBOT,
      }
      this.character = ch;
      this.setupForm();
    }
  }

  setupForm() {
    let chatbotIsDefault = true;
    let chatbotURl = this.DUMMY_CHATBOT;
    if (this.character.chatbotUrl !== this.DUMMY_CHATBOT) {
      chatbotIsDefault = false;
      chatbotURl = this.character.chatbotUrl
    }

    this.characterForm = new FormGroup({
      name: new FormControl(this.character.name, [Validators.required]),
      description: new FormControl(this.character.description),
      title: new FormControl(this.character.title),
      history: new FormControl(),
      context: new FormControl(),
      prompt: new FormControl(),
      utterance: new FormControl(),
      response: new FormControl(),
      useDummyChatbot: new FormControl(chatbotIsDefault),
      chatbotUrl: new FormControl(chatbotURl, [Validators.required]),
    })
  }

  get name() { return this.characterForm.get('name') }
  get description() { return this.characterForm.get('description') }
  get title() { return this.characterForm.get('title') }
  get history() { return this.characterForm.get('history') }
  get context() { return this.characterForm.get('context') }
  get useDummyChatbot() { return this.characterForm.get('useDummyChatbot') }
  get chatbotUrl() { return this.characterForm.get('chatbotUrl') }

  onChangeUseDummyChatbot() {
    if (this.useDummyChatbot?.value === true) {
      this.characterForm.controls['chatbotUrl'].patchValue(this.DUMMY_CHATBOT);
    } else {
      if (this.chatbotUrl?.value === this.DUMMY_CHATBOT) {
        this.characterForm.controls['chatbotUrl'].patchValue("");
      }
    }
  }

  onSubmit() {
    if (this.characterForm.valid) {
      let characterToSend: Character = {
        id: this.character.id,
        name: this.name?.value,
        description: this.description?.value,
        title: this.title?.value,
        chatbotUrl: this.chatbotUrl?.value,
      }

      // If a new character is being created, send POST Request
      if (this.createNewCharacter) {
        this.gameService
          .createCharacter(this.game.id, characterToSend)
          .subscribe(character => {
            this.character = character;
            this.updatedCharacter.emit(this.character);
          })

      } else {
        // Send PUT request to update character to API
        this.gameService
          .updateCharacter(this.character.id, characterToSend)
          .subscribe(character => {
            this.character = character;
            this.updatedCharacter.emit(this.character);
          })

      }
    }
  }

  deleteCharacter() {
    if (this.character?.id && !this.createNewCharacter) {
      if(confirm("Are you sure you want to delete this character?")) {
        this.gameService
          .deleteCharacter(this.character.id)
          .subscribe(result => {
            this.deletedCharacter.emit(this.character);
          })
      }
    }
  }
}
