import {Component, ViewChild, ElementRef, OnInit, NgZone} from '@angular/core';
import * as PIXI from 'pixi.js';
import {Router} from "@angular/router";

/**
 * This component is deprecated. Please navigate to component "play/:id" to play the game, with data fetched from REST API
 */

@Component({
  selector: 'app-game',
  template: ''
})
export class PlayDemoAvatarComponent implements OnInit {
  private app: PIXI.Application = new PIXI.Application({
    backgroundAlpha: 0,
    width: window.innerWidth/10*9,
    height: window.innerHeight/6*4
  });

  private stage = new PIXI.Container();
  private chatStage1 = new PIXI.Container();

  constructor(private router: Router) { }

  ngOnInit(): void {
    document.body.appendChild(this.app.view);

    this.app.renderer.view.style.position = 'absolute';
    this.app.renderer.view.style.left = '50%';
    this.app.renderer.view.style.top = '50%';
    this.app.renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';


    var backgroundTexture = PIXI.Texture.from('../../assets/table.jpg');

    var background1 = new PIXI.Sprite(backgroundTexture);
    background1.anchor.x = 0;
    background1.anchor.y = 0;
    background1.position.x = 0;
    background1.position.y = 0;

    var background2 = new PIXI.Sprite(backgroundTexture);
    background2.anchor.x = 0;
    background2.anchor.y = 0;
    background2.position.x = 720;
    background2.position.y = 0;

    this.stage.addChild(background1);
    this.stage.addChild(background2);


    // Create the sprite and add it to the stage
    // 225, 45, 250, 250
    let stakeholder1 = PIXI.Sprite.from('../../assets/avatars/m-r.png');
    stakeholder1.name = "avatar-red";
    stakeholder1.x = 225;
    stakeholder1.y = 45;
    stakeholder1.width = 250;
    stakeholder1.height = 250;
    this.stage.addChild(stakeholder1);

    stakeholder1.interactive = true;
    stakeholder1.buttonMode = true;
    stakeholder1.on('pointerdown', (event) => this.onClickStakeholder(stakeholder1));
    stakeholder1.on('pointerover', (event) => this.onPointerOver(stakeholder1));
    stakeholder1.on('pointerout', (event) => this.onPointerOut(stakeholder1));

    let stakeholder1Name = new PIXI.Text('Max Muster \nCEO',{fontFamily : 'Arial', fontSize: 34, fill : 0x000000, align : 'center'});
    stakeholder1Name.name = "red-avatar-name";
    stakeholder1Name.position.x = 260;
    stakeholder1Name.position.y = 390;
    this.stage.addChild(stakeholder1Name);

    let stakeholder1Note = new PIXI.Text('Max Muster is the founder of the company. Max is not the domain expert of the order process specifically, but he has wide ranging knowledge on most processes in the company and the interconnectivity between them. Click on Max to find out more!',{fontFamily : 'Arial', fontSize: 18, fill : 0x000000, wordWrap: true, wordWrapWidth: 600});
    stakeholder1Note.name = "red-avatar-note";
    stakeholder1Note.position.x = 50;
    stakeholder1Note.position.y = 500;
    stakeholder1Note.visible = false;
    this.stage.addChild(stakeholder1Note);

    let stakeholder2 = PIXI.Sprite.from('../../assets/avatars/m-b.png');
    stakeholder2.name = "avatar-blue";
    stakeholder2.x = 945;
    stakeholder2.y = 45;
    stakeholder2.width = 250;
    stakeholder2.height = 250;

    stakeholder2.interactive = true;
    stakeholder2.buttonMode = true;
    stakeholder2.on('pointerdown', (event) => this.onClickStakeholder(stakeholder2));
    stakeholder2.on('pointerover', (event) => this.onPointerOver(stakeholder2));
    stakeholder2.on('pointerout', (event) => this.onPointerOut(stakeholder2));

    let stakeholder2Name = new PIXI.Text('Hans Zimmer \nProduct Manager',{fontFamily : 'Arial', fontSize: 34, fill : 0x000000, align : 'center'});
    stakeholder2Name.name = "blue-avatar-name";
    stakeholder2Name.position.x = 970;
    stakeholder2Name.position.y = 390;
    this.stage.addChild(stakeholder2Name);

    let stakeholder2Note = new PIXI.Text('Hans works as a Product Manager at Max Muster GmbH. He his the domain expoert of the ordering process. Click on Hans to find out more!',{fontFamily : 'Arial', fontSize: 18, fill : 0x000000, wordWrap: true, wordWrapWidth: 600});
    stakeholder2Note.name = "blue-avatar-note";
    stakeholder2Note.position.x = 800;
    stakeholder2Note.position.y = 500;
    stakeholder2Note.visible = false;
    this.stage.addChild(stakeholder2Note);

    this.stage.addChild(stakeholder2);




    // Chat for stakeholder 2

    //var chatStage2 = new PIXI.Container();

    var chatExampleTexture = PIXI.Texture.from('../../assets/chat-example.jpg');

    var chatBackground = new PIXI.Sprite(chatExampleTexture);
    chatBackground.anchor.x = 0;
    chatBackground.anchor.y = 0;
    chatBackground.position.x = 200;
    chatBackground.position.y = 0;
    this.chatStage1.addChild(chatBackground);
    //chatStage2.addChild(chatBackground);

    let stakeholder1Chat = PIXI.Sprite.from('../../assets/avatars/m-r.png');
    stakeholder1Chat.name = "red-avatar-chat";
    stakeholder1Chat.x = 980;
    stakeholder1Chat.y = 30;
    stakeholder1Chat.width = 200;
    stakeholder1Chat.height = 200;
    stakeholder1Chat.interactive = true;
    stakeholder1Chat.on('pointerover', (event) => this.onPointerOver(stakeholder2Chat));
    stakeholder1Chat.on('pointerout', (event) => this.onPointerOut(stakeholder2Chat));
    this.chatStage1.addChild(stakeholder1Chat);

    let stakeholder1Desc = new PIXI.Text('Name: Max Muster \nPosition: CEO',{fontFamily : 'Arial', fontSize: 18, fill : 0x000000, align : 'left'});
    stakeholder1Desc.name = "red-avatar-desc-chat";
    stakeholder1Desc.position.x = 980;
    stakeholder1Desc.position.y = 260;
    this.chatStage1.addChild(stakeholder1Desc);

    let stakeholder2Chat = PIXI.Sprite.from('../../assets/avatars/m-b.png');
    stakeholder2Chat.name = "blue-avatar-chat";
    stakeholder2Chat.x = 980;
    stakeholder2Chat.y = 30;
    stakeholder2Chat.width = 200;
    stakeholder2Chat.height = 200;
    stakeholder2Chat.interactive = true;
    stakeholder2Chat.on('pointerover', (event) => this.onPointerOver(stakeholder2Chat));
    stakeholder2Chat.on('pointerout', (event) => this.onPointerOut(stakeholder2Chat));
    this.chatStage1.addChild(stakeholder2Chat);

    let stakeholder2Desc = new PIXI.Text('Name: Hans Zimmer \nPosition: Product Manager',{fontFamily : 'Arial', fontSize: 18, fill : 0x000000, align : 'left'});
    stakeholder2Desc.name = "blue-avatar-desc-chat";
    stakeholder2Desc.position.x = 980;
    stakeholder2Desc.position.y = 260;
    this.chatStage1.addChild(stakeholder2Desc);

    let endConversationBtn = PIXI.Sprite.from('../../assets/end-conversation.jpg')
    endConversationBtn.x = 990;
    endConversationBtn.y = 440;
    endConversationBtn.width = 175;
    endConversationBtn.height = 60;
    endConversationBtn.interactive = true;
    endConversationBtn.buttonMode = true;
    endConversationBtn.on('pointerdown', (event) => this.onClickEndConversation(endConversationBtn));
    endConversationBtn.on('pointerover', (event) => this.onPointerOver(endConversationBtn));
    endConversationBtn.on('pointerout', (event) => this.onPointerOut(endConversationBtn));
    this.chatStage1.addChild(endConversationBtn);
    //chatStage2.addChild(endConversationBtn);

    this.chatStage1.visible = false;
    //chatStage2.visible = false;

    this.app.stage.addChild(this.stage);
    this.app.stage.addChild(this.chatStage1);
    //this.app.stage.addChild(chatStage2)

  }

  onClickStakeholder(object: PIXI.Sprite) {
    object.tint = 0x666666;

    this.stage.visible = false;
    this.chatStage1.visible = true;

    if(object.name === "avatar-red") {
      this.chatStage1.getChildByName("blue-avatar-chat").visible = false;
      this.chatStage1.getChildByName("blue-avatar-desc-chat").visible = false;
      this.chatStage1.getChildByName("red-avatar-chat").visible = true;
      this.chatStage1.getChildByName("red-avatar-desc-chat").visible = true;
    } else {
      this.chatStage1.getChildByName("blue-avatar-chat").visible = true;
      this.chatStage1.getChildByName("blue-avatar-desc-chat").visible = true;
      this.chatStage1.getChildByName("red-avatar-chat").visible = false;
      this.chatStage1.getChildByName("red-avatar-desc-chat").visible = false;

    }
  }

  onClickEndConversation(object: PIXI.Sprite) {
    object.tint = 0x666666;
    //this.app.stage.children[0].visible = true;
    //this.app.stage.children[1].visible = false;
    //this.app.stage.children[2].visible = false;
    this.stage.visible = true;
    this.chatStage1.visible = false;
  }

  onPointerOver(object: PIXI.Sprite) {
    object.tint = 0x666666;


    if(object.name === "avatar-red") {
      this.stage.getChildByName("red-avatar-note").visible = true;
      this.stage.getChildByName("blue-avatar-note").visible = false;

    } else {
      this.stage.getChildByName("red-avatar-note").visible = false;
      this.stage.getChildByName("blue-avatar-note").visible = true;
    }
  }

  onPointerOut(object: PIXI.Sprite) {
    object.tint = 0xFFFFFF;

    this.stage.getChildByName("red-avatar-note").visible = false;
    this.stage.getChildByName("blue-avatar-note").visible = false;

  }

  ngOnDestroy() {
    this.app.destroy(true);
  }


}


/*
@Component({
  selector: 'app-play-demo-avatar',
  template: `
    <div fxLayout="column" fxLayoutAlign="space-between center" style="margin-top: 200px;">
        <canvas #playCanvas width="1440" height="480"></canvas>
        <!--<button style="margin-top: 10px" (click)="animate()">Play</button>-->
    </div>
  `,
  styles: ['canvas { border-style: solid }']
  //templateUrl: './play-demo-avatar.component.html',
  //styleUrls: ['./play-demo-avatar.component.css']
})
export class PlayDemoAvatarComponent implements OnInit {
  @ViewChild('playCanvas', {static: true})
  playCanvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;

  public context!: CanvasRenderingContext2D | null;

  //constructor() { }

  ngOnInit(): void {
    this.context = this.playCanvas.nativeElement.getContext('2d');
    this.initiateCanvas();
  }

  initiateCanvas() {

    console.log("testing");

    const img = new Image();
    img.src = "../../assets/table.jpg";
    img.onload = () => {
      this.context!.drawImage(img, 0, 0);
      this.context!.drawImage(img, 720,0);
    }

    const avatarImg1 = new Image();
    avatarImg1.src = "../../assets/avatars/m-b.png";
    avatarImg1.onload = () => {
      this.context!.drawImage(avatarImg1, 225, 45, 250, 250);

    }

    const avatarImg2 = new Image();
    avatarImg2.src = "../../assets/avatars/m-r.png";
    avatarImg2.onload = () => {
      this.context!.drawImage(avatarImg2, 945, 45, 250, 250);//225
    }

    var pathAvatarImg1 = new Path2D();
    pathAvatarImg1.rect(225, 45, 250, 250);

    var avatars = [];




  };

  animateAvatar(event: any) {
    console.log("wat");

  }
}

export class Square {
  constructor(private ctx: CanvasRenderingContext2D) {}

  draw(x: number, y: number, z: number) {
    this.ctx.fillRect(z * x, z * y, z, z);
  }

  move(y: number, z: number) {
    const max = this.ctx.canvas.width / z;
    const canvas = this.ctx.canvas;
    let x = 0;
    const i = setInterval(() => {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.draw(x, y, z);
      x++;
      if (x >= max) {
        clearInterval(i);
      }
    }, 200);
  }

}

export class Avatar {
  constructor(private ctx: CanvasRenderingContext2D) {}

  draw(id: String, x: number, y: number, width: number, height: number) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillRect(x, y, width, height);
  }


}
*/
