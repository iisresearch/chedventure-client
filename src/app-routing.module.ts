import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent} from "@okta/okta-angular";
import {GameComponent} from "./app/features/game/game.component";
import {HomeComponent} from "./app/features/home/home.component";
import {PlayComponent} from "./app/features/play/play/play.component";
import {PlayDemoAvatarComponent} from "./app/features/play/play-demo-avatar/play-demo-avatar.component";
import {PlayDemoComponent} from "./app/features/play/play-demo/play-demo.component";
import {GameEditorComponent} from "./app/features/game-designer/game-editor/game-editor.component";

const routes: Routes = [
  {
    path: 'login/callback',
    component: OktaCallbackComponent
  },
  {
    path: 'game',
    component: GameComponent,
    canActivate: [ OktaAuthGuard ]
  },
  {
    path: 'game-editor/:id',
    component: GameEditorComponent,
    canActivate: [ OktaAuthGuard ]
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'play/:id',
    component: PlayComponent,
  },
  {
    path: 'draft/:id',
    component: PlayComponent,
    canActivate: [ OktaAuthGuard ]
  },
  {
    path: 'play-demo-avatar',
    component: PlayDemoAvatarComponent,
    canActivate: [ OktaAuthGuard ]
  },
  {
    path: 'play-demo',
    component: PlayDemoComponent,
    canActivate: [ OktaAuthGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
