import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Room} from "../../../core/models/game";
import * as PIXI from "pixi.js";

@Component({
  selector: 'app-game-room-detail-canvas',
  templateUrl: './game-room-detail-canvas.component.html',
  styleUrls: ['./game-room-detail-canvas.component.css']
})
export class GameRoomDetailCanvasComponent implements AfterViewInit {
  private app: PIXI.Application = new PIXI.Application({
    backgroundAlpha: 0,
    width: 750,
    height: 750
  });

  @ViewChild('canvas', {static: false}) canvas!: ElementRef;


  @Input() room!: Room;
  @Input() showHitboxWithId!: number;

  constructor() { }

  ngAfterViewInit(): void {
    this.canvas.nativeElement.append(this.app.view);
  }

  ngOnChanges() {
    if(this.app.stage.children.length !== 0) {
      this.app.stage.removeChildAt(0);
    }
    console.log(this.showHitboxWithId)

    if(this.room) {
      var container = new PIXI.Container();

      /**
       *  Convert image of type ArrayBuffer to base64String
       *  https://medium.com/@koteswar.meesala/convert-array-buffer-to-base64-string-to-display-images-in-angular-7-4c443db242cd
       */
      let typedArray = new Uint8Array(this.room.image.data);
      const STRING_CHAR = typedArray.reduce((data, byte)=> {
        return data + String.fromCharCode(byte)
      }, '');
      let base = btoa(STRING_CHAR);
      let b64s = "data:image/jpg;base64,"+base;

      // Create a PIXI.sprite from the room image
      var roomSprite = PIXI.Sprite.from(b64s);

      // Position and size of room on Canvas
      roomSprite.anchor.x = 0;
      roomSprite.anchor.y = 0;
      roomSprite.width = 750;
      roomSprite.position.x = 0;
      roomSprite.position.y = 0;

      //Add room to PIXI container
      container.addChild(roomSprite);

      if (this.room.hitboxes) {

        // Loop through all hitboxes of room & add each to canvas
        for (var hitbox of this.room!.hitboxes!) {

          // Get all coordinates of hitbox
          var points: PIXI.Point[] = [];
          for (var coordinate of hitbox.coordinates) {
            points.push(new PIXI.Point(coordinate.x, coordinate.y));
          }
          // Form PIXI.Polygon with all coordinates
          var hitboxPolygon = new PIXI.Polygon(points);

          // Configure hitbox as a PIXI.Graphic
          var roomHitbox = new PIXI.Graphics();
          roomHitbox.name = String(hitbox.id);
          roomHitbox.beginFill(0x565656);
          roomHitbox.alpha = 0.6;

          if (hitbox.id === this.showHitboxWithId) {
            roomHitbox.lineStyle(10, 0xb0001f);
          }

          roomHitbox.drawShape(hitboxPolygon);
          roomHitbox.endFill();
          roomHitbox.interactive = false;
          roomHitbox.buttonMode = false;
          roomHitbox.hitArea = hitboxPolygon;
          container.addChild(roomHitbox);
        }
        this.app.stage.addChild(container);
      }
    }
  }

  ngOnDestroy() {
    this.app.destroy(true);
  }

  destroy(){
    this.app.destroy(true);
  }

}
