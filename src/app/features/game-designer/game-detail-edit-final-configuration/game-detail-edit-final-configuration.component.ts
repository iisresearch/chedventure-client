import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Game, InitialRoom, RoomToGame} from "../../../core/models/game";
import {baseUrlDomain, GameService} from "../../../core/game.service";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";

@Component({
  selector: 'app-game-detail-edit-final-configuration',
  templateUrl: './game-detail-edit-final-configuration.component.html',
  styleUrls: ['./game-detail-edit-final-configuration.component.css']
})
export class GameDetailEditFinalConfigurationComponent implements OnInit {

  @Input() game!: Game;
  @Output() gameChange = new EventEmitter<Game>();
  roomsToGame!: RoomToGame[];

  gameConfigurationForm: UntypedFormGroup = new UntypedFormGroup({
    initialRoom: new UntypedFormControl(),
    documentation: new UntypedFormControl(),
    isPublished: new UntypedFormControl(),
  })

  baseUrlD = baseUrlDomain;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    if (this.game.id) {
      this.getRoomsInGame(this.game.id);
    }
  }

  getRoomsInGame(id: string): void {
    this.gameService.getRoomsInGame(id)
      .subscribe(roomToGame => {
        this.roomsToGame = roomToGame;
      })
  }

  ngOnChanges() {
    this.gameConfigurationForm = new UntypedFormGroup({
      initialRoom: new UntypedFormControl(this.game.initialRoom?.id),
      documentation: new UntypedFormControl(this.game.documentation),
      isPublished: new UntypedFormControl(this.game.isPublished)
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
