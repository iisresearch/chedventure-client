import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Room} from "../../../../core/models/game";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {GameService} from "../../../../core/game.service";

@Component({
  selector: 'app-game-room-detail-select-dialog',
  templateUrl: './game-room-detail-select-dialog.component.html',
  styleUrls: ['./game-room-detail-select-dialog.component.css']
})
export class GameRoomDetailSelectDialogComponent implements OnInit {

  constructor(private gameService: GameService, public dialogRef: MatDialogRef<GameRoomDetailSelectDialogComponent>, private _sanitizer: DomSanitizer,
              @Inject(MAT_DIALOG_DATA) public data: {rooms: Room[]}) { }

  ngOnInit(): void {
  }

  getImageOfRoom(room: Room): SafeUrl {
    let typedArray = new Uint8Array(room.image.data);
    const STRING_CHAR = typedArray.reduce((data, byte)=> {
      return data + String.fromCharCode(byte)
    }, '');
    let base64String = btoa(STRING_CHAR);
    return this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);
  }

  onSelect(room: Room) {
    this.dialogRef.close(room);
  }

  onDelete(room: Room) {
    if (room.createdByUserId) {
      if (confirm("Are you sure you want to permanently delete this room you created?")) {
        this.gameService
          .deleteCustomRoom(room.id)
          .subscribe(result => {
            console.log(result);
            location.reload();
          })
      }
    }
  }

}
