import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {Character, Game} from "../../../../core/models/game";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GameService} from "../../../../core/game.service";
import {MatSelectChange} from "@angular/material/select";
import {environment} from "../../../../../environments/environment";

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

  DEFAULT_CHATBOT: string = environment.chatbotURL+"/?character_id=-1"; // = environment.chatbotURL+"/?character_id="; // "https://creator.voiceflow.com/prototype/626abdde3e2ab5c39626f392";

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
    // useDefaultChatbot: new FormControl(true),
    // chatbotUrl: new FormControl("", [Validators.required]),
  })

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
        history: 0,
        chatbotUrl: this.DEFAULT_CHATBOT,
        contexts: [],
      }
      this.character = ch;
      this.setupForm();
    }
  }

  setupForm() {
    this.DEFAULT_CHATBOT = environment.chatbotURL+"/?character_id="+this.character?.id;
    let chatbotIsDefault = true;
    let chatbotURl = this.DEFAULT_CHATBOT;
    if (this.character.chatbotUrl !== this.DEFAULT_CHATBOT) {
      chatbotIsDefault = false;
      chatbotURl = this.character.chatbotUrl
    }

    this.characterForm = new FormGroup({
      name: new FormControl(this.character.name, [Validators.required]),
      description: new FormControl(this.character.description),
      title: new FormControl(this.character.title),
      history: new FormControl(this.character.history, [Validators.required]),
      useDefaultChatbot: new FormControl(chatbotIsDefault),
      chatbotUrl: new FormControl(chatbotURl, [Validators.required]),
    })
  }

  get name() { return this.characterForm.get('name') }
  get description() { return this.characterForm.get('description') }
  get title() { return this.characterForm.get('title') }
  get history() { return this.characterForm.get('history') }
  get useDefaultChatbot() { return this.characterForm.get('useDefaultChatbot') }
  get chatbotUrl() { return this.characterForm.get('chatbotUrl') }

  onChangeUseDefaultChatbot() {
    if (this.useDefaultChatbot?.value === true) {
      this.characterForm.controls['chatbotUrl'].patchValue(this.DEFAULT_CHATBOT);
    } else {
      if (this.chatbotUrl?.value === this.DEFAULT_CHATBOT) {
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
        history: this.history?.value,
        chatbotUrl: this.chatbotUrl?.value,
        contexts: this.character.contexts,
      }
      console.log("Character: ", characterToSend)

      // If a new character is being created, send POST Request
      if (this.createNewCharacter) {
        this.gameService.createCharacter(this.game.id, characterToSend)
          .subscribe(character => {
            // Update ChatbotUrl to include character id if default chatbot is on
            if (this.useDefaultChatbot?.value === true) {
              if (!character.id) throw new Error("Character ID is not defined");
              character.chatbotUrl = environment.chatbotURL + "/?character_id=" + character.id;
              this.gameService.updateCharacter(character.id, character)
                  .subscribe(updatedCharacter => {
                    this.character = updatedCharacter;
                    this.updatedCharacter.emit(this.character);
                  });
            } else {
              this.character = character;
              this.updatedCharacter.emit(this.character);
            }
          })

      } else {
        // Send PUT request to update character to API
        this.gameService.updateCharacter(this.character.id, characterToSend)
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
        this.gameService.deleteCharacter(this.character.id)
          .subscribe(result => {
            this.deletedCharacter.emit(this.character);
          })
      }
    }
  }
}
