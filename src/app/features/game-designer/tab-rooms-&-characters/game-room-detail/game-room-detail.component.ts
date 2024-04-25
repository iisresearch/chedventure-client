import {Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Character, Game, IGame, Room, RoomToGame} from "../../../../core/models/game";
import {GameService} from "../../../../core/game.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {MatSelectionListChange} from "@angular/material/list";

@Component({
  selector: 'app-game-room-detail',
  templateUrl: './game-room-detail.component.html',
  styleUrls: ['./game-room-detail.component.css']
})
export class GameRoomDetailComponent implements OnInit {

  //roomToGameForm!: FormGroup;
  @Input() game!: Game;
  @Output() gameChange = new EventEmitter<Game>();

  selectedRoomToGame!: RoomToGame[];
  compareRoomToGameFunction = (o1: any, o2: any)=> o1.id===o2.id;
  rooms!: Room[];
  roomsToGame!: RoomToGame[];

  characters!: Character[];
  selectedCharacter!: Character[];
  compareCharactersFunction = (o1: any, o2: any)=> o1.id===o2.id;
  @Output() charactersChange = new EventEmitter<Character[]>();

  createNewRoom = false;
  createNewCharacter = false;


  constructor(private gameService: GameService, private myElement: ElementRef) {}

  ngOnInit(): void {
    this.getRooms();
    this.getRoomsInGame(this.game.id);
    this.getCharactersInGame(this.game.id);
  }

  /**
   * Is called from child component 'game-room-detail-edit' when a roomToGame has been updated.
   * @param roomToGame
   */
  updatedRoomToGame(roomToGame: RoomToGame) {
    let i = this.roomsToGame.findIndex(obj => {
      return obj.id === roomToGame.id;
    })
    if (i === -1) {
      this.roomsToGame.push(roomToGame);
    } else {
      this.roomsToGame[i] = roomToGame;
    }
    this.selectedRoomToGame = [roomToGame];
    this.createNewRoom = false;
  }

  /**
   * Is called from child component 'game-room-detail-edit' when a roomToGame has been deleted.
   * @param roomToGame
   */
  deletedRoomToGame(roomToGame: RoomToGame) {
    let i = this.roomsToGame.findIndex(obj => {
      return obj.id === roomToGame.id;
    })
    if (i !== -1) {
      //delete this.roomsToGame[i];
      this.roomsToGame.splice(i, 1);
    }
    this.selectedRoomToGame = [];

  }

  /**
   * Is called from child component 'game-room-detail-edit' when a new room has been created.
   * @param room
   */
  addedNewRoom(room: Room) {
    this.rooms.push(room);
  }

  /**
   * Is called from child component 'game-room-detail-edit' when a custom room has been deleted.
   * @param room
   */
  deletedCustomRoom(room: Room) {
    let i = this.roomsToGame.findIndex(obj => {
      return obj.id === room.id;
    })
    if (i !== -1) {
      //delete this.roomsToGame[i];
      this.rooms.splice(i, 1);
    }
  }

  roomToGameIsSelected(roomToGame: RoomToGame): boolean {
    if (this.selectedRoomToGame && this.selectedRoomToGame.length !== 0 && roomToGame) {
      return this.compareRoomToGameFunction(roomToGame, this.selectedRoomToGame[0].id);
    } else {
      return false;
    }
  }

  onChangeRoom(change: MatSelectionListChange) {
    this.selectedCharacter = [];
    this.createNewRoom = false;
    this.createNewCharacter = false;
  }

  createRoomToGame() {
    this.createNewRoom = true;
    this.createNewCharacter = false;
    this.selectedRoomToGame = [];
    this.selectedCharacter = [];
  }

  /**
   * Is called from child component 'game-character-detail-edit' when a character has been updated.
   * @param character
   */
  updatedCharacter(character: Character) {
    let i = this.characters.findIndex(obj => {
      return obj.id === character.id;
    })
    if (i === -1) {
      this.characters.push(character);
    } else {
      this.characters[i] = character;
    }
    this.selectedCharacter = [character];
    this.createNewCharacter = false;
    this.charactersChange.emit(this.characters);
  }

  /**
   * Is called from child component 'game-character-detail-edit' when a character has been deleted.
   * @param character
   */
  deletedCharacter(character: Character) {
    let i = this.characters.findIndex(obj => {
      return obj.id === character.id;
    })
    if (i !== -1) {
      this.characters.splice(i, 1);
    }
    this.selectedCharacter = [];
    this.charactersChange.emit(this.characters);
  }

  characterIsSelected(character: Character): boolean {
    if (this.selectedCharacter && this.selectedCharacter.length !== 0 && character) {
      return this.compareCharactersFunction(character, this.selectedCharacter[0].id);
    } else {
      return false;
    }
  }

  onChangeCharacter(change: MatSelectionListChange) {
    this.selectedRoomToGame = [];
    this.createNewRoom = false;
    this.createNewCharacter = false;
  }

  createCharacter() {
    this.createNewCharacter = true;
    this.createNewRoom = false;
    this.selectedRoomToGame = [];
    this.selectedCharacter = [];
  }

  getRooms(): void {
    this.gameService.getRooms()
      .subscribe(room => {
        this.rooms = room;
      })
  }

  getRoomsInGame(id: string): void {
    this.gameService.getRoomsInGame(id)
      .subscribe(roomToGame => {
        this.roomsToGame = roomToGame;
      })
  }

  getCharactersInGame(id: string): void {
    this.gameService.getCharactersInGame(id)
      .subscribe(characters => {
        this.characters = characters;
        this.charactersChange.emit(this.characters);
      })
  }

  onSubmit() {
    /*if (this.roomForm.valid) {
      if (this.roomForm.dirty) {

      }
    }*/
  }

}
