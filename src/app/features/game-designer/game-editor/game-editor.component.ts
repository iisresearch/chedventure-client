import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {Game} from "../../../core/models/game";
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

  game!: Game;

  gameForm!: UntypedFormGroup;

  finishedFetchingData = false;

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
        this.gameForm = new UntypedFormGroup({
          name: new UntypedFormControl(this.game.name, [Validators.required]),
          subtitle: new UntypedFormControl(this.game.subtitle),
          author: new UntypedFormControl(this.game.author, [Validators.required]),
          version: new UntypedFormControl(this.game.version, [Validators.required])
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


}
