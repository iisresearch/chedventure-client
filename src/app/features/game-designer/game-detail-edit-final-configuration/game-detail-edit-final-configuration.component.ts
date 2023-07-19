import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Game, InitialRoom, RoomToGame} from "../../../core/models/game";
import {baseUrlDomain, GameService} from "../../../core/game.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-game-detail-edit-final-configuration',
  templateUrl: './game-detail-edit-final-configuration.component.html',
  styleUrls: ['./game-detail-edit-final-configuration.component.css']
})
export class GameDetailEditFinalConfigurationComponent implements OnInit {

  @Input() game!: Game;
  @Output() gameChange = new EventEmitter<Game>();
  roomsToGame!: RoomToGame[];

  gameConfigurationForm: FormGroup = new FormGroup({
    initialRoom: new FormControl(),
    documentation: new FormControl(),
    isPublished: new FormControl(),
  })

  baseUrlD = baseUrlDomain;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.getRoomsInGame(this.game.id);
  }

  getRoomsInGame(id: string): void {
    this.gameService.getRoomsInGame(id)
      .subscribe(roomToGame => {
        this.roomsToGame = roomToGame;
      })
  }

  ngOnChanges() {
    this.gameConfigurationForm = new FormGroup({
      initialRoom: new FormControl(this.game.initialRoom?.id),
      documentation: new FormControl(this.game.documentation),
      isPublished: new FormControl(this.game.isPublished)
    })
  }

  get initialRoom() { return this.gameConfigurationForm.get('initialRoom'); }
  get documentation() { return this.gameConfigurationForm.get('documentation'); }
  get isPublished() { return this.gameConfigurationForm.get('isPublished'); }

  onSubmit() {
    if (this.gameConfigurationForm.valid) {
      var initialRoom: InitialRoom|undefined = this.initialRoom?.value;
      if (this.initialRoom) {
        initialRoom = {id: this.initialRoom?.value}
      }
      let updateGame = new Game(this.game.id, this.game.name, this.game.subtitle, this.game.author, this.game.version, undefined, undefined, initialRoom, this.documentation?.value, this.isPublished?.value ?? false);
      this.gameService
        .updateGame(this.game.id, updateGame)
        .subscribe(game => {
          this.game = game;
          this.gameChange.emit(this.game);
        })
    }
  }

}
