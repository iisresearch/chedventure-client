import { Component, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import {Router} from "@angular/router";
import * as PIXI from "pixi.js";
import { Stakeholder } from "../../../core/models/stakeholder";
import {Observable} from "rxjs";

/**
 * This component is deprecated. Please navigate to component "play/:id" to play the game, with data fetched from REST API
 */


@Component({
  selector: 'app-play-demo',
  templateUrl: './play-demo.component.html',
  styleUrls: ['play-demo.component.css']
})
export class PlayDemoComponent implements OnInit {
  private app: PIXI.Application = new PIXI.Application({
    backgroundAlpha: 0,
    width: 750,
    height: 750
  });


  stakeholders: Stakeholder[] = [
    {
      'id': 1,
      'name': "Sally Mustermann",
      "position": "Product Manager",
      "description": "Sally is the domain expert of the ordering process. Chat with Sally and focus on finding out the specifics of the ordering process.",
      "chatbotUrl": "https://creator.voiceflow.com/prototype/626abdde3e2ab5c39626f392",
    },
    {
      'id': 2,
      'name': "Ximena Hans",
      "position": "CEO",
      "description": "Ximena is the founder of the company. Ximena is not the domain expert of the order process specifically, but she has wide ranging knowledge on most processes in the company and the interconnectivity between them.",
      "chatbotUrl": "https://creator.voiceflow.com/prototype/626abdde3e2ab5c39626f392",
    },
    {
      'id': 3,
      'name': "Lucy Biplap",
      "position": "Secretary",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sollicitudin dictum nulla et tempus. Pellentesque eleifend arcu in nunc ultricies iaculis.",
      "chatbotUrl": "https://creator.voiceflow.com/prototype/626abdde3e2ab5c39626f392",
    }
  ]

  moveBackIsDisabled: boolean = true;
  moveToMapIsDisabled: boolean = true;

  mapIsShown: boolean = true;
  hoverRoom: boolean = false;

  roomIsShown: boolean = false;
  hoverStakeholder: boolean = false;

  chatIsShown: boolean = false;


  // Properties to use for toolbar
  public selectedStakeholderName: string|null|undefined = null;
  public selectedStakeholderPosition: string|null|undefined = null;
  public selectedStakeholderDescription: string|null|undefined = null;

  // Stakeholder to chat with
  selectedStakeholder: Stakeholder|null = null;

  private groundPlanStage = new PIXI.Container();
  private roomStage1 = new PIXI.Container();

  constructor(private router: Router) { }

  ngOnInit(): void {
    document.body.appendChild(this.app.view);

    /*this.app.renderer.view.style.position = 'absolute';
    this.app.renderer.view.style.left = '100';
    this.app.renderer.view.style.top = '50%';*/
    this.app.renderer.view.style.transform = 'translate3d( 5em, 5em, 0 )';

    var backgroundTexture = PIXI.Texture.from('../../assets/buerogrundriss.jpg');
    var backgroundFloorPlan = new PIXI.Sprite(backgroundTexture);
    //backgroundFloorPlan.interactive = true;
    //backgroundFloorPlan.buttonMode = true;
    backgroundFloorPlan.anchor.x = 0;
    backgroundFloorPlan.anchor.y = 0;
    backgroundFloorPlan.width = 750;
    backgroundFloorPlan.position.x = 0;
    backgroundFloorPlan.position.y = 0;
    this.groundPlanStage.addChild(backgroundFloorPlan);


    // ROOM NR 1
    // Polygon area room 1
    var floorPlanPolygonHitArea1 = new PIXI.Polygon([
      new PIXI.Point(11,188),
      new PIXI.Point(165,188),
      new PIXI.Point(163,370),
      new PIXI.Point(13,370)
    ])

    var room1Hitbox = new PIXI.Graphics();
    room1Hitbox.beginFill(0x000000);
    room1Hitbox.alpha = 0.2;
    room1Hitbox.drawShape(floorPlanPolygonHitArea1);
    room1Hitbox.endFill();
    room1Hitbox.interactive = true;
    room1Hitbox.buttonMode = true;
    room1Hitbox.on("pointerdown", () => {
      console.log("Clicked meeting room");
    })
    this.groundPlanStage.addChild(room1Hitbox);

    // ROOM NR 2
    // Polygon area room 2
    var floorPlanPolygonHitArea2 = new PIXI.Polygon([
      new PIXI.Point(300, 170),
      new PIXI.Point(535, 170),
      new PIXI.Point(535, 270),
      new PIXI.Point(300, 270),
    ])

    var room2Hitbox = new PIXI.Graphics();
    room2Hitbox.name = "conference-room-hitbox";
    room2Hitbox.beginFill(0x000000);
    room2Hitbox.alpha = 0.2;
    room2Hitbox.drawShape(floorPlanPolygonHitArea2);
    room2Hitbox.endFill();
    room2Hitbox.interactive = true;
    room2Hitbox.buttonMode = true;
    room2Hitbox.on("pointerdown", () => {
      this.onClickRoom(room2Hitbox);
    })
    room2Hitbox.on("pointerover", (event) => this.toggleHoverRoom());
    room2Hitbox.on("pointerout", (event) => this.toggleHoverRoom());
    this.groundPlanStage.addChild(room2Hitbox);

    // Conference Room

    var backgroundTextureRoom1 = PIXI.Texture.from('../../assets/meeting-room.jpg');
    var backgroundRoom1 = new PIXI.Sprite(backgroundTextureRoom1);
    //backgroundFloorPlan.interactive = true;
    //backgroundFloorPlan.buttonMode = true;
    backgroundRoom1.anchor.x = 0;
    backgroundRoom1.anchor.y = 0;
    backgroundRoom1.width = 750;
    backgroundRoom1.position.x = 0;
    backgroundRoom1.position.y = 0;
    this.roomStage1.addChild(backgroundRoom1);

    // 1st Stakeholder
    var sh2Polygon = new PIXI.Polygon([
      new PIXI.Point(180, 250),
      new PIXI.Point(315, 250),
      new PIXI.Point(315, 410),
      new PIXI.Point(180, 410),
    ])
    var sh2Hitbox = new PIXI.Graphics();
    sh2Hitbox.name = "Sally Mustermann";
    sh2Hitbox.beginFill(0x000000);
    sh2Hitbox.alpha = 0;
    sh2Hitbox.drawShape(sh2Polygon);
    sh2Hitbox.endFill();
    sh2Hitbox.interactive = true;
    sh2Hitbox.buttonMode = true;
    sh2Hitbox.on("pointerdown", () => {
      this.onClickStakeholder(sh2Hitbox);
    })
    sh2Hitbox.on("pointerover", (event) => this.toggleHoverStokeholder(0));
    sh2Hitbox.on("pointerout", (event) => this.toggleHoverStokeholder(0));
    this.roomStage1.addChild(sh2Hitbox);

    // 2nd Stakeholder
    var sh3Polygon = new PIXI.Polygon([
      new PIXI.Point(325, 235),
      new PIXI.Point(430, 235),
      new PIXI.Point(430, 410),
      new PIXI.Point(325, 410),
    ])
    var sh3Hitbox = new PIXI.Graphics();
    sh3Hitbox.name = "Ximena Hans";
    sh3Hitbox.beginFill(0x000000);
    sh3Hitbox.alpha = 0;
    sh3Hitbox.drawShape(sh3Polygon);
    sh3Hitbox.endFill();
    sh3Hitbox.interactive = true;
    sh3Hitbox.buttonMode = true;
    sh3Hitbox.on("pointerdown", () => {
      this.onClickStakeholder(sh3Hitbox);
    })
    sh3Hitbox.on("pointerover", (event) => this.toggleHoverStokeholder(1));
    sh3Hitbox.on("pointerout", (event) => this.toggleHoverStokeholder(1));
    this.roomStage1.addChild(sh3Hitbox);

    // 3rd Stakeholder
    var sh4Polygon = new PIXI.Polygon([
      new PIXI.Point(440, 235),
      new PIXI.Point(565, 235),
      new PIXI.Point(565, 410),
      new PIXI.Point(440, 410),
    ])
    var sh4Hitbox = new PIXI.Graphics();
    sh4Hitbox.name = "Lucy Biplap";
    sh4Hitbox.beginFill(0x000000);
    sh4Hitbox.alpha = 0;
    sh4Hitbox.drawShape(sh4Polygon);
    sh4Hitbox.endFill();
    sh4Hitbox.interactive = true;
    sh4Hitbox.buttonMode = true;
    sh4Hitbox.on("pointerdown", () => {
      this.onClickStakeholder(sh4Hitbox);
    })
    sh4Hitbox.on("pointerover", (event) => this.toggleHoverStokeholder(2));
    sh4Hitbox.on("pointerout", (event) => this.toggleHoverStokeholder(2));
    this.roomStage1.addChild(sh4Hitbox);

    this.roomStage1.visible = false;
    this.groundPlanStage.visible = true;

    this.app.stage.addChild(this.groundPlanStage);
    this.app.stage.addChild(this.roomStage1);

    var seconds = 0;
    this.app.ticker.add( function(delta) {
      seconds += (0.5/60) * delta;
      // Increase alpha of room highlights on even seconds and decrease on uneven seconds
      if(Math.ceil(seconds) % 2 == 0) {
        room1Hitbox.alpha += 0.002;
        room2Hitbox.alpha += 0.002;
      } else {
        room1Hitbox.alpha -= 0.002;
        room2Hitbox.alpha -= 0.002;
      }
    })

  }

  onClickRoom(object: PIXI.Graphics) {
    if(object.name === "conference-room-hitbox") {
      this.groundPlanStage.visible = false;
      this.roomStage1.visible = true;
      //this.hoverRoom = false;
      this.toggleMapIsShown();
      this.toggleRoomIsShown();
    }
  }

  onClickStakeholder(object: PIXI.Graphics) {
    this.selectedStakeholder = this.getStakeholderByName(object.name);
    this.roomStage1.visible = false;
    //this.hoverStakeholder = false;
    this.toggleRoomIsShown();
    this.toggleChatIsShown();
  }

  getStakeholderByName(name: string): Stakeholder|null {
    var stakeholder = this.stakeholders.find(x => x.name == name);
    if(stakeholder == undefined) {
      return null
    } else {
      return stakeholder!;
    }
  }

  moveBack() {
    //this.hoverStakeholder = true;
    //this.hoverRoom = false;

    this.mapIsShown = false;
    this.roomIsShown = true;
    this.chatIsShown = false;

    this.moveToMapIsDisabled = false;
    this.moveBackIsDisabled = true;

    this.groundPlanStage.visible = false;
    this.roomStage1.visible = true;
  }

  moveToMap() {
    //this.hoverStakeholder = false;
    //this.hoverRoom = true;

    this.mapIsShown = true;
    this.roomIsShown = false;
    this.chatIsShown = false;

    this.moveToMapIsDisabled = true;
    this.moveBackIsDisabled = true;

    this.roomStage1.visible = false;
    this.groundPlanStage.visible = true;
  }

  toggleMapIsShown() {
    this.mapIsShown = !this.mapIsShown;
    this.moveToMapIsDisabled = true;
    this.moveBackIsDisabled = true;
  }

  toggleRoomIsShown() {
    this.roomIsShown = !this.roomIsShown;
    this.moveToMapIsDisabled = false;
    this.moveBackIsDisabled = true;
  }

  toggleChatIsShown() {
    this.chatIsShown = !this.chatIsShown;
    this.moveToMapIsDisabled = false;
    this.moveBackIsDisabled = false;
  }

  toggleHoverRoom() {
    this.hoverRoom = !this.hoverRoom;
  }

  toggleHoverStokeholder(i: number) {
    if(this.hoverStakeholder == true) {
      this.selectedStakeholderName = null;
      this.selectedStakeholderPosition = null;
      this.selectedStakeholderDescription = null;
      this.hoverStakeholder = false;
    } else {
      this.selectedStakeholder = this.stakeholders[i];
      this.selectedStakeholderName = this.stakeholders[i].name;
      this.selectedStakeholderPosition = this.stakeholders[i].position;
      this.selectedStakeholderDescription = this.stakeholders[i].description;
      this.hoverStakeholder = true;
    }
  }

  ngOnDestroy() {
    this.app.destroy(true);
  }

}
