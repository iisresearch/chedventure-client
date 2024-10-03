import {Component, ViewChild, ElementRef, OnInit, NgZone, Inject} from '@angular/core';
import { PipeTransform, Pipe } from "@angular/core";
import {DomSanitizer, SafeHtml, SafeUrl} from "@angular/platform-browser";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import * as PIXI from "pixi.js";
import {Stakeholder} from "../../../core/models/stakeholder";
import {Room} from "../../../core/models/room";
import {Map} from "../../../core/models/map";
import {Hitbox, Coordinate} from "../../../core/models/hitbox";
import {GameService} from "../../../core/game.service";
import {filter, Subscription, switchMap, take} from "rxjs";
import {Character, HitboxesToRoomToGame, IGame, RoomToGame} from "../../../core/models/game";
import {MatDialog, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MessageService, MessageStatus} from "../../../core/message.service";

import confetti from 'canvas-confetti';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  private app: PIXI.Application = new PIXI.Application({
    backgroundAlpha: 0,
    width: 750,
    height: 750
  });

  /**
   * Once data of game is loaded from API it is saved in this variable.
   * Check out "./models/game" to see the interface object
   */
  game: IGame | undefined;

  /**
   * Game is being played as draft (it is password protected and does not
   * have to be published yet in order to be shown.
   */
  playInDraftMode: boolean = false;

  /**
   * Holds the current room which is being showed to the user
   */
  currentStage: PIXI.Container = new PIXI.Container();
  currentRoom: RoomToGame|null|undefined;

  containers: PIXI.Container[] = [];

  pixiHitboxesToBlink: PIXI.Graphics[] = [];

  /**
   * Determine if a hitbox is being hovered, in order to display target room/character in toolbar
   */
  hitboxIsHovered: boolean = false;
  hoveredHitboxTargetRoom: RoomToGame|null|undefined;
  hoveredHitboxTargetCharacter: Character|null|undefined;

  // Determine if chat should be shown
  showCharacterChat = false;
  currentCharacter: Character|null|undefined;

  /**
   * Holds ID's of all rooms the user has navigated through.
   * The last entry in the array is the previous room the user  entered.
   *
   * Is used to navigate back a room ("Move back a room" button), in which case the last entry in array is used to
   * open the room and at the same is then removed from the array.
   *
   * When user moves back to first room in the game ("Go to first room" button),
   * all entries are removed from this array.
   */
  roomNavigationTree: number[] = [];

  moveBackButtonIsDisabled = true;
  moveToInitialRoomButtonIsDisabled = true;

  constructor(public _router: Router, private route: ActivatedRoute,
              private _sanitizer: DomSanitizer, private gameService: GameService,
              public dialog: MatDialog, private messageService: MessageService) {
    this._router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (val.url.toString().includes("draft")) {
          this.playInDraftMode = true;
        } else {
          this.playInDraftMode = false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getGameToPlay(params['id'])
    });
  }

  getGameToPlay(id: string) {
    return this.gameService.playGame(id)
      .pipe(filter(e => !!e), take(1))
      .subscribe(game => {
        if (this.playInDraftMode || game.isPublished) {
          this.game = game;
          this.renderGame();
        } else {
          this.messageService.Show("This game has not been published yet.", MessageStatus.Warning);
        }
      });
  }

  renderGame() {

    // Add Canvas to DOM and add margin
    document.body.appendChild(this.app.view);
    this.app.renderer.view.style.transform = 'translate3d( 5em, 3em, 0 )';
    if(this.game?.roomToGames) {

      for (var roomToGame of this.game.roomToGames) {
        // Create Container for each room
        var container = new PIXI.Container();
        container.name = String(roomToGame.id);

        /**
         *  Convert image of type ArrayBuffer to base64String
         *  https://medium.com/@koteswar.meesala/convert-array-buffer-to-base64-string-to-display-images-in-angular-7-4c443db242cd
         */
        let typedArray = new Uint8Array(roomToGame.room.image.data);
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

        // Loop through all hitboxes of room & add each to canvas
        for (var hitboxToRoomToGame of roomToGame.hitboxesToRoomToGame) {

          // Get all coordinates of hitbox
          var points: PIXI.Point[] = [];
          for (var coordinate of hitboxToRoomToGame.hitbox.coordinates) {
            points.push(new PIXI.Point(coordinate.x, coordinate.y));
          }
          // Form PIXI.Polygon with all coordinates
          var hitboxPolygon = new PIXI.Polygon(points);

          // Configure hitbox as a PIXI.Graphic
          var roomHitbox = new PIXI.Graphics();
          roomHitbox.name = "hitbox-" + hitboxToRoomToGame.id;
          roomHitbox.beginFill(0x000000);
          if(hitboxToRoomToGame.displayHitbox) {
            roomHitbox.alpha = 0.2;
          } else {
            roomHitbox.alpha = 0;
          }
          roomHitbox.drawShape(hitboxPolygon);
          roomHitbox.endFill();
          roomHitbox.interactive = true;
          roomHitbox.buttonMode = true;
          roomHitbox.hitArea = hitboxPolygon;

          // setup interactions of user with hitbox

          // Interactions with pointer devices such as mouse
          roomHitbox.on("click", (e) => {
            this.onClickRoomHitbox(e.target);
          });
          roomHitbox.on("mouseover", (e) => this.toggleHitboxIsHoveredToTrue(e.target));
          roomHitbox.on("mouseout", () => this.toggleHitboxIsHoveredToFalse());

          // Interactions with touch
          roomHitbox.on("tap", (e) => this.evaluateTapOnHitbox(e.target));

          /*roomHitbox.on("pointerdown", (e) => {
            this.onClickRoomHitbox(e.target);
          });
          roomHitbox.on("pointerover", (e) => this.toggleHitboxIsHoveredToTrue(e.target));
          roomHitbox.on("pointerout", () => this.toggleHitboxIsHoveredToFalse());*/
          container.addChild(roomHitbox);

          if(hitboxToRoomToGame.blink) {
            this.pixiHitboxesToBlink.push(roomHitbox);
          }
        }
        // Hide PIXI Containers except for the initial room to display
        if(roomToGame.id === this.game.initialRoom?.id) {
          container.visible = true;
          this.currentStage = container;
          this.currentRoom = roomToGame;
        } else {
          container.visible = false;
        }

        this.app.stage.addChild(container)
        this.containers.push(container);
      }
    }

    if (!this.game?.initialRoom?.id) {
      this.messageService.Show("Game has no initial room defined. Go to 'Final Configuration' in the setup process.", MessageStatus.Warning);
    }

    // Animate hitboxes where hitbox->blink==true  (blinking effect)
    var seconds = 0;
    var roomHitboxes = this.pixiHitboxesToBlink;
    this.app.ticker.add( function(delta) {
      seconds += (0.5/60) * delta;
      // Increase alpha of map hitboxes on even seconds and decrease on uneven seconds
      if(roomHitboxes !== undefined) {
        for (var hitbox of roomHitboxes) {
          if(Math.ceil(seconds) % 2 == 0) {
            hitbox.alpha += 0.002;
          } else {
            hitbox.alpha -= 0.002;
          }
        }
      }
    })

  }

  /**
   * On touch devices such as iPads mouse-hover is not possible for preview of room/character.
   * So, on touch devices on first click of hitbox it is previewed in the toolbar. If touched again, it is selected.
   */
  evaluateTapOnHitbox(object: PIXI.Graphics) {
    // If a hitbox is already hovered it must be determined if a new hitbox should be previewed or a hitbox
    // which is already being hovered should be selected
    if (this.hitboxIsHovered) {
      let id = Number(object.name.split('-')[1]);
      let hitbox = this.getHitbox(id);

      // Check if the already hovered room or hovered character is the same as the one clicked.
      // If true -> select and enter target room/character, if false -> select new room/character to preview
      if(hitbox?.targetRoom && hitbox?.targetRoom?.id === this.hoveredHitboxTargetRoom?.id) {
        this.onClickRoomHitbox(object);
      } else {
        if(hitbox?.targetCharacter && hitbox?.targetCharacter?.id === this.hoveredHitboxTargetCharacter?.id) {
          this.onClickRoomHitbox(object);
          return;
        }
        this.toggleHitboxIsHoveredToTrue(object)
      }
    } else {
      this.toggleHitboxIsHoveredToTrue(object)
    }
  }

  onClickRoomHitbox(object: PIXI.Graphics) {
    let id = Number(object.name.split('-')[1]);
    let hitbox = this.getHitbox(id);

    if(hitbox?.targetRoom) {
      this.openRoom(hitbox?.targetRoom!.id, true, false);
    } else if (hitbox?.targetCharacter) {
      this.openRoom(hitbox?.targetCharacter!.id, true, true);
    }
    this.evaluateDisablingMoveBackButton();
    this.evaluateDisablingMoveToInitialRoomButton();
  }

  // Deprecated
  /*toggleHoverMapHitbox() {
    this.hoverMapHitbox = !this.hoverMapHitbox;
  }*/

  toggleHitboxIsHoveredToTrue(object: PIXI.Graphics) {
    let id = Number(object.name.split('-')[1]);
    let hitbox = this.getHitbox(id);
    if(hitbox?.targetRoom) {
      this.hoveredHitboxTargetRoom = this.getRoom(hitbox.targetRoom!.id);
      this.hitboxIsHovered = true;
    } else if (hitbox?.targetCharacter) {
      this.hoveredHitboxTargetCharacter = this.getCharacter(hitbox.targetCharacter!.id);
      this.hitboxIsHovered = true;
    }

  }

  toggleHitboxIsHoveredToFalse() {
    this.hitboxIsHovered = false;
    this.hoveredHitboxTargetRoom = null;
    this.hoveredHitboxTargetCharacter = null;
  }

  openRoom(id: number, addToRoomNavigationTree: Boolean, openCharacter: boolean) {
    let containerToView = this.containers.find(x => x.name == String(id));
    if(containerToView !== undefined && openCharacter === false) {
      if (addToRoomNavigationTree) {
        this.roomNavigationTree.push(Number(this.currentStage.name));
      }
      this.currentStage.visible = false;
      this.currentCharacter = null;
      this.showCharacterChat = false;
      this.currentStage = containerToView;
      this.currentRoom = this.getRoom(id);
      this.currentStage.visible = true;
      this.hitboxIsHovered = false;
      this.hoveredHitboxTargetRoom = null;
      this.hoveredHitboxTargetCharacter = null;
    } else {
      // If <containerToView> is undefined, the targetId must be of a stakeholder.

      let character = this.getCharacter(id);
      if(character !== undefined) {
        if (addToRoomNavigationTree) {
          this.roomNavigationTree.push(Number(this.currentStage.name));
        }
        // Open chat with stakeholder
        this.currentStage.visible = false;
        this.currentCharacter = character;
        this.showCharacterChat = true;
        this.hitboxIsHovered = false;
        this.hoveredHitboxTargetRoom = null;
        this.hoveredHitboxTargetCharacter = null;
      }

    }
  }

  moveBack() {
    let lastRoom = this.roomNavigationTree.pop();
    if(lastRoom !== undefined) {
      this.openRoom(lastRoom, false, false);
    }
    this.evaluateDisablingMoveBackButton();
    this.evaluateDisablingMoveToInitialRoomButton();
  }

  moveToInitialRoom() {
    if (this.game?.initialRoom === undefined) { return }
    let inititalRoomId = this.game!.initialRoom.id;
    this.openRoom(inititalRoomId, false, false);
    this.roomNavigationTree = [];
    this.evaluateDisablingMoveBackButton();
    this.evaluateDisablingMoveToInitialRoomButton();
  }

  evaluateDisablingMoveBackButton() {
    if(this.roomNavigationTree.length === 0) {
      this.moveBackButtonIsDisabled = true
    } else {
      this.moveBackButtonIsDisabled = false;
    }
  }

  evaluateDisablingMoveToInitialRoomButton() {
    if (this.game?.initialRoom === undefined) { return }
    if(Number(this.currentStage.name) == this.game!.initialRoom.id) {
      this.moveToInitialRoomButtonIsDisabled = true;
    } else {
      this.moveToInitialRoomButtonIsDisabled = false;
    }
  }

  /*getRoom(id: number): Room|undefined {
    return this.rooms.find(x => x.id == id);
  }*/

  getRoom(id: number): RoomToGame | undefined {
    if (this.game?.roomToGames) {
      return this.game.roomToGames.find(x => x.id == id);
    }
    return undefined;
  }

  /*getStakeholder(id: number): Stakeholder|undefined {
    return this.stakeholders.find(x => x.id == id);
  }*/

  getCharacter(id: number): Character|undefined {
    if (this.game?.characters) {
      return this.game.characters.find(x => x.id == id);
    }
    return undefined;
  }

  getHitbox(id: number): HitboxesToRoomToGame|undefined {
    if(this.game?.roomToGames) {
      let room = this.game.roomToGames.find((x) => x.hitboxesToRoomToGame.find((y) => y.id == id));
      if(room !== undefined) {
        return room.hitboxesToRoomToGame.find(x => x.id == id);
      } else { return undefined }
    } else {
      return undefined
    }

  }

  /**
   * Convert image from API of type ArrayBuffer to image
   * https://medium.com/@koteswar.meesala/convert-array-buffer-to-base64-string-to-display-images-in-angular-7-4c443db242cd
   */

  getImageOfRoom(roomToGame: RoomToGame): SafeUrl {

    let typedArray = new Uint8Array(roomToGame.room.image.data);
    const STRING_CHAR = typedArray.reduce((data, byte)=> {
      return data + String.fromCharCode(byte)
    }, '');
    let base64String = btoa(STRING_CHAR);
    return this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);
  }

  ngOnDestroy() {
    this.app.destroy(true);
  }

  openGameDocumentationDialog() {
    console.log(this.game?.documentation);
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '750px',
      data: {documentation: this.game?.documentation, name: this.game?.name, subtitle: this.game?.subtitle, author: this.game?.author, version: this.game?.version}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openGitHubLink() {
    window.open("https://github.com/kiril-buga", "_blank");
  }

  openRickRoll() {
    // Trigger the confetti effect
    const duration = 2000; // in milliseconds

    confetti({
      particleCount: 200,
      spread: 160,
      origin: { y: 0.6 },
    });

    // Clear confetti after a certain duration
    setTimeout(() => {
      confetti.reset();
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    }, duration);

  }

  openContributeGithubLink() {
    window.open('https://github.com/iisresearch/ChEdBot', '_blank');
  }
}

export interface DialogDataGameDocumentation {
  documentation?: string;
  name: string;
  subtitle?: string,
  author: string,
  version: string,
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogDataGameDocumentation) {
  }
}

