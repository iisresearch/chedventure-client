import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {GameService} from "../../../core/game.service";
import {Coordinate, Hitbox, Room} from "../../../core/models/game";
import {HttpClient} from "@angular/common/http";
import {MessageService, MessageStatus} from "../../../core/message.service";

@Component({
  selector: 'app-game-room-detail-create-custom-room-dialog',
  templateUrl: './game-room-detail-create-custom-room-dialog.component.html',
  styleUrls: ['./game-room-detail-create-custom-room-dialog.component.css']
})
export class GameRoomDetailCreateCustomRoomDialogComponent implements OnInit {

  roomForm: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required]),
    file: new FormControl(null, Validators.required),
    hitboxes: new FormArray([]),
  })

  addHitbox(hitboxCommaSeperatedCoordinates: string) {
    this.hitboxes?.push(new FormControl(hitboxCommaSeperatedCoordinates))
  }

  removeHitbox(index: number) {
    this.hitboxes.removeAt(index);
  }

  constructor(private httpClient: HttpClient, public dialogRef: MatDialogRef<GameRoomDetailCreateCustomRoomDialogComponent>,
              private gameService: GameService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onFileChange(event: any) {
    let i = this.hitboxes.length
    for (let _ in this.hitboxes) {
      this.removeHitbox(i);
      i =- 1;
    }
    this.addHitbox("");
    let reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        var img = new Image();
        img.onload = () => {
          console.log(img.width)
          console.log(img.height)

          if (img.width !== 750) {
            this.messageService.Show("Image width must precisely be 750px", MessageStatus.Error);
            return
          };
          if (img.height > 750) {
            this.messageService.Show("Image height cannot exceed 750px", MessageStatus.Error);
            return
          }

          this.roomForm.patchValue({
            file: reader.result
          });
        }
        img.src = String(reader.result);
      }
    };
  }

  get name() { return this.roomForm.get('name'); }
  get fileImage() { return this.roomForm.get('file'); }
  get hitboxes() { return this.roomForm.get('hitboxes') as FormArray; }

  onSubmit() {
    if (this.roomForm.valid) {

      let hitboxes: Hitbox[]|null = [];
      for (let hitbox of this.roomForm.value.hitboxes) {
        if (hitbox !== "" && hitbox !== " ") {
          let h = this.parseCoordinatesIntoHitbox(hitbox);
          if (h === false) {
            this.messageService.Show("Coordinates could not be parsed", MessageStatus.Error);
            return;
          }
          if (h && h !== true) {
            hitboxes.push(h);
          }
        }
      }

      const base64 = this.fileImage?.value.replace(/^data:(.*,)?/, "");

      let room: Room = {
        id: -1,
        name: this.name?.value,
        image: base64,
        hitboxes: hitboxes,
      }
      this.gameService
        .createCustomRoom(room)
        .subscribe(room => {
          if (room) {
            this.dialogRef.close(room)
          }
        })
    }
  }

  parseCoordinatesIntoHitbox(coordinatesCommaSeparated: string): Hitbox|boolean|null {
    let cds = coordinatesCommaSeparated.split(',');
    if (cds.length === 0) {
      return null;
    }
    let i = 0;
    var coordinates: Coordinate[] = [];
    var x: number = 0;
    for (let coordinateString of cds) {
      if (!this.isNumber(coordinateString)) {
        return false;
      }
      let c = Number(coordinateString);
      if (i % 2 == 0) {
        x = c;
      } else {
        let coordinate: Coordinate = {
          x: x,
          y: c,
        }
        coordinates.push(coordinate);
      }
      i = 1 + i;
    }
    if (coordinates) {
      let hitbox: Hitbox = {
        id: -1,
        coordinates: coordinates,
      }
      return hitbox;
    }
    return null;
  }

  isNumber(value: string | number): boolean {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return false;
    }

    const num = Number(value);

    if (Number.isInteger(num)) {
      return true;
    }

    return false;
  }




}
