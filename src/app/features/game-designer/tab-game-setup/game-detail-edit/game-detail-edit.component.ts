import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GameService} from "../../../../core/game.service";
import {Game, IGame} from "../../../../core/models/game";

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail-edit.component.html',
  styleUrls: ['./game-detail-edit.component.css']
})
export class GameDetailEditComponent implements OnInit {

  @Input() gameForm!: FormGroup;
  @Input() game!: Game;
  @Output() gameChange = new EventEmitter<Game>();

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    if (this.gameForm === undefined) {
    }
  }

  get name() { return this.gameForm.get('name'); }
  get subtitle() { return this.gameForm.get('subtitle'); }
  get author() { return this.gameForm.get('author'); }
  get version() { return this.gameForm.get('version'); }

  onSubmit() {
    if (this.gameForm.valid) {
      if (this.gameForm.dirty) {
        let updateGame = new Game(this.game.id, this.name!.value, this.subtitle?.value, this.author!.value, this.version!.value, undefined, undefined, this.game.initialRoom, this.game.documentation, this.game.isPublished);
        this.gameService
          .updateGame(updateGame.id, updateGame)
          .subscribe(game => {
            this.game = game;
            this.gameChange.emit(this.game);
          });
      }
    }
  }

}
