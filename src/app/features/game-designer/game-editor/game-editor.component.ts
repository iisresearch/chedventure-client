import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent} from "@angular/cdk/stepper";
import {Character, Game} from "../../../core/models/game";
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../../../core/game.service";
import {MatStepper} from "@angular/material/stepper";

@Component({
  selector: 'app-game-editor',
  templateUrl: './game-editor.component.html',
  styleUrls: ['./game-editor.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true}
    }
  ]
})
export class GameEditorComponent implements OnInit {
  @ViewChild('stepper') private stepper!: MatStepper;

  reloadChatbot = false;

  game!: Game;

  gameForm!: FormGroup;

  finishedFetchingData = false;

  characters!: Character[];

  constructor(private route: ActivatedRoute, private gameService: GameService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getGame(params['id'])
    });
  }

  getGame(id: string): void {

    this.gameService.getGame(id)
      .subscribe(game => {
        this.game = game;
        this.gameForm = new FormGroup({
          name: new FormControl(this.game.name, [Validators.required]),
          subtitle: new FormControl(this.game.subtitle),
          author: new FormControl(this.game.author, [Validators.required]),
          version: new FormControl(this.game.version, [Validators.required])
        });
        this.finishedFetchingData = true;
      });
  }

  openDocumentation() {
    window.open("assets/chedventure-documentation.pdf") //    window.open("assets/documents/" + fileName);
  }

  playDraftGame() {
    window.open("/draft/"+this.game.id, "_blank")
  }

  onCharactersChange(characters: Character[]) {
    this.characters = characters;
  }

  onStepperSelectionChange(event: StepperSelectionEvent, INDEX_OF_CHATBOT_STEP: number) {
    if (event.selectedIndex === INDEX_OF_CHATBOT_STEP) {
      this.reloadChatbot = !this.reloadChatbot;
    }
  }

}
