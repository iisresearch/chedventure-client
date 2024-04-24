import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {Character, Game, Hitbox, HitboxesToRoomToGame, Room, RoomToGame} from "../../../../core/models/game";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {FormArray, FormControl, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {GameRoomDetailSelectDialogComponent} from "../game-room-detail-select-dialog/game-room-detail-select-dialog.component";
import {GameService} from "../../../../core/game.service";
import {GameRoomDetailCreateCustomRoomDialogComponent} from "../game-room-detail-create-custom-room-dialog/game-room-detail-create-custom-room-dialog.component";

@Component({
  selector: 'app-game-room-detail-edit',
  templateUrl: './game-room-detail-edit.component.html',
  styleUrls: ['./game-room-detail-edit.component.css']
})
export class GameRoomDetailEditComponent implements OnInit {
  @Input() game!: Game;

  @Input() roomToGame!: RoomToGame;
  @Output() updatedRoomToGame = new EventEmitter<RoomToGame>();
  @Output() deletedRoomToGame = new EventEmitter<RoomToGame>();

  @Input() roomsToGame!: RoomToGame[];
  @Input() characters!: Character[];

  @Input() rooms!: Room[];
  @Output() addedNewRoom = new EventEmitter<Room>();
  @Output() deletedCustomRoom = new EventEmitter<Room>();

  @Input() createNewRoomToGame!: boolean;

  selectedRoom!: Room;
  selectedHitboxes!: Hitbox[];

  showHitboxWithId!: number;

  roomToGameForm: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required]),
    description: new FormControl(""),
    instructions: new FormArray([]),
    room: new FormControl(null),
    hitboxesToRoomToGame: new FormArray([]),
  })

  addInstruction(instruction: String) {
    this.instructions?.push(new FormControl(instruction));
  }

  removeInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  newHitboxToRoomToGame(id: number|null, active: boolean, hitbox: number,
                        targetRoom: number|null, targetCharacter: number|null,
                        displayHitbox: boolean, blink: boolean): FormGroup {
    return new FormGroup({
      id: new FormControl(id),
      active: new FormControl(active),
      hitbox: new FormControl(hitbox),
      targetRoom: new FormControl({value: targetRoom, disabled: !active}),
      targetCharacter: new FormControl({value: targetCharacter, disabled: !active}),
      displayHitbox: new FormControl({value: displayHitbox, disabled: !active}),
      blink: new FormControl({value: blink, disabled: !active}),
    })
  }

  constructor(private _sanitizer: DomSanitizer, public dialog: MatDialog, private gameService: GameService) { }

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.roomToGame !== undefined && this.roomToGame !== null && this.createNewRoomToGame === false) {
      let room = this.getRoomById(this.roomToGame.room.id);
      if (room !== undefined) {
        this.setupForm(room, this.roomToGame.name, this.roomToGame.description ?? "", this.roomToGame.instructions ?? []);
      }
    } else {
      let rTG: RoomToGame = {
        id: -1,
        name: "",
        description: null,
        instructions: null,
        room: this.selectedRoom,
        hitboxesToRoomToGame: [],
      };
      this.roomToGame = rTG;
    }
  }

  setupForm(room: Room, name: string, description: string, instructions: String[]) {
    this.selectedRoom = room;

    this.roomToGameForm = new FormGroup({
      name: new FormControl(name, [Validators.required]),
      description: new FormControl(description),
      instructions: new FormArray([]),
      room: new FormControl(this.selectedRoom.id),
      hitboxesToRoomToGame: new FormArray([]),
    })

    for (var instruction of instructions) {
      this.addInstruction(instruction);
    }

    this.selectedRoom.hitboxes!.forEach(hitbox => {
      let formGroupHitboxToRoom = this.hitboxesToRoomToGame;
      let hitboxToRoomToGame = this.getHitboxToRoomToGame(hitbox.id);

      const isActive = !!hitboxToRoomToGame; // If hitboxToRoomToGame is not null, then it is true

      formGroupHitboxToRoom.push(this.newHitboxToRoomToGame(hitboxToRoomToGame?.id ?? null,
        isActive,
        hitbox.id,
        hitboxToRoomToGame?.targetRoom?.id ?? null,
        hitboxToRoomToGame?.targetCharacter?.id ?? null,
        hitboxToRoomToGame?.displayHitbox ?? false,
        hitboxToRoomToGame?.blink ?? false))
    });
  }

  getImageOfRoom(room: Room): SafeUrl {
    let typedArray = new Uint8Array(room.image.data);
    const STRING_CHAR = typedArray.reduce((data, byte)=> {
      return data + String.fromCharCode(byte)
    }, '');
    let base64String = btoa(STRING_CHAR);
    return this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);
  }

  openSelectRoomDialog() {
    let screenHeight = window.innerHeight / 10 * 8;
    let screenWidth = window.innerWidth / 10 * 8;

    const dialogRef = this.dialog.open(GameRoomDetailSelectDialogComponent, {
      height: String(screenHeight) + "px",
      width: String(screenWidth) + "px",
      data: { rooms: this.rooms }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let room: Room = result;
        this.setupForm(room, room.name, "", [
          "Hover over any of the rooms or stakeholders to get a preview in the toolbar.",
          "Select the room or character you would like to enter or interact with."
        ]);
      }
    })
  }

  openCreateCustomRoomDialog() {
    let screenHeight = window.innerHeight / 10 * 8;
    let screenWidth = window.innerWidth / 10 * 8;

    const dialogRef = this.dialog.open(GameRoomDetailCreateCustomRoomDialogComponent, {
      height: String(screenHeight) + "px",
      width: String(screenWidth) + "px",
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        let room: Room = result;
        this.setupForm(room, room.name, "", [
          "Hover over any of the rooms or stakeholders to get a preview in the toolbar.",
          "Select the room or character you would like to enter or interact with."
        ]);
        this.addedNewRoom.emit(room);
      }
    })
  }

  hitboxToRoomToGame(hitboxId: number): boolean {
    if(this.roomToGame.hitboxesToRoomToGame.length !== 0) {
      for (var hitboxToRoomToGame of this.roomToGame.hitboxesToRoomToGame) {
        if (hitboxToRoomToGame.hitbox.id === hitboxId) {
          return true;
        }
      }
    }
    return false;
  }

  getHitboxToRoomToGame(hitboxId: number): HitboxesToRoomToGame|null {
    if(this.roomToGame.hitboxesToRoomToGame.length !== 0) {
      for (var hitboxToRoomToGame of this.roomToGame.hitboxesToRoomToGame) {
        if (hitboxToRoomToGame.hitbox.id === hitboxId) {
          return hitboxToRoomToGame;
        }
      }
    }
    return null;
  }

  getRoomById(id: number): Room|undefined {
    if (this.rooms !== undefined && this.rooms !== null) {
      return this.rooms.find(x => x.id == id);
    }
    return undefined;
  }

  get name() { return this.roomToGameForm.get('name'); }
  get description() { return this.roomToGameForm.get('description'); }
  get room() { return this.roomToGameForm.get('room'); }
  get instructions() { return this.roomToGameForm.get('instructions') as FormArray; }
  get hitboxesToRoomToGame() { return this.roomToGameForm.get('hitboxesToRoomToGame') as FormArray; }

  onSubmit() {
    if (this.roomToGameForm.valid) {

      let instructions: String[]|null = [];
      for (let instruction of this.roomToGameForm.value.instructions) {
        instructions.push(instruction)
      }

      let hitboxesToRoomToGame: HitboxesToRoomToGame[] = [];
      for (let hitboxToRoomToGame of this.roomToGameForm.value.hitboxesToRoomToGame) {
        if (hitboxToRoomToGame.active) {
          let h: HitboxesToRoomToGame = {id: hitboxToRoomToGame.id, displayHitbox: hitboxToRoomToGame.displayHitbox,
            blink: hitboxToRoomToGame.blink, hitbox:
            hitboxToRoomToGame.hitbox,
            targetCharacter: hitboxToRoomToGame.targetCharacter,
            targetRoom: hitboxToRoomToGame.targetRoom
          }
            hitboxesToRoomToGame.push(h);
        }
      }
      if (instructions.length === 0) {
        instructions = null;
      }
      let roomToGameToSend : RoomToGame = {
        id: this.roomToGame.id,
        name: this.name!.value,
        description: this.description?.value,
        instructions: instructions,
        room: this.room?.value,
        hitboxesToRoomToGame: hitboxesToRoomToGame
      }

      // If a new roomToGame is being created, send POST Request to API
      if (this.createNewRoomToGame) {
        this.gameService
          .createRoomToGame(this.game.id, roomToGameToSend)
          .subscribe(roomToGame => {
            this.roomToGame = roomToGame;
            this.updatedRoomToGame.emit(this.roomToGame);
          });
      } else {
        // Send PUT request to update roomToGame to API
        this.gameService
          .updateRoomToGame(this.roomToGame.id, roomToGameToSend)
          .subscribe(roomToGame => {
            this.roomToGame = roomToGame;
            this.updatedRoomToGame.emit(this.roomToGame);
          });
      }

    }
  }

  deleteRoomToGame() {
    if (this.roomToGame?.id && !this.createNewRoomToGame) {
      if(confirm("Are you sure you want to delete this room?")) {
        this.gameService
          .deleteRoomToGame(this.roomToGame.id)
          .subscribe(result => {
            this.deletedRoomToGame.emit(this.roomToGame);
          })
      }
    }
  }

  onTargetCharacterChange(object: any, i: number) {
    this.hitboxesToRoomToGame.controls[i].patchValue({targetRoom: null})
  }

  onTargetRoomChange(object: any, i: number) {
    this.hitboxesToRoomToGame.controls[i].patchValue({targetCharacter: null})
  }

  changeHitboxToShow($event: any) {
    this.showHitboxWithId = this.selectedRoom!.hitboxes![$event.value].id;
  }
}
