import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/shared/app.component';

import { FlexLayoutModule} from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { MatStepperModule} from "@angular/material/stepper";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule} from "@angular/material/radio";
import { MatSnackBarModule} from "@angular/material/snack-bar";
import { MatTooltipModule} from "@angular/material/tooltip";
import { ClipboardModule} from "@angular/cdk/clipboard";

import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./app/core/auth.interceptor";

import { ProfileComponent } from './app/shared/profile/profile.component';
import { GameComponent } from './app/features/game/game.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './app/features/home/home.component';
import { PlayDemoAvatarComponent } from './app/features/play/play-demo-avatar/play-demo-avatar.component';
import { PlayDemoComponent } from './app/features/play/play-demo/play-demo.component';
import {DialogContentExampleDialog, PlayComponent} from './app/features/play/play/play.component';
import { SafePipe } from './app/shared/safe.pipe';
import { GameEditorComponent } from './app/features/game-designer/game-editor/game-editor.component';
import { GameDetailEditComponent } from './app/features/game-designer/tab-game-setup/game-detail-edit/game-detail-edit.component';
import { GameCreateDialogComponent } from './app/features/game-designer/game-create-dialog/game-create-dialog.component';
import { GameRoomDetailComponent } from './app/features/game-designer/tab-rooms-&-characters/game-room-detail/game-room-detail.component';
import { GameRoomDetailEditComponent } from './app/features/game-designer/tab-rooms-&-characters/game-room-detail-edit/game-room-detail-edit.component';
import { GameRoomDetailSelectDialogComponent } from './app/features/game-designer/tab-rooms-&-characters/game-room-detail-select-dialog/game-room-detail-select-dialog.component';
import { MessageErrorToastComponent, MessageWarningToastComponent, MessageSuccessToastComponent } from "./app/core/message.service";
import { GameRoomDetailCanvasComponent } from './app/features/game-designer/tab-rooms-&-characters/game-room-detail-canvas/game-room-detail-canvas.component';
import { GameCharacterDetailEditComponent } from './app/features/game-designer/tab-rooms-&-characters/game-character-detail-edit/game-character-detail-edit.component';
import { GameDetailEditFinalConfigurationComponent } from './app/features/game-designer/tab-final-configuration/game-detail-edit-final-configuration/game-detail-edit-final-configuration.component';
import { GameRoomDetailCreateCustomRoomDialogComponent } from './app/features/game-designer/tab-rooms-&-characters/game-room-detail-create-custom-room-dialog/game-room-detail-create-custom-room-dialog.component';
import { GameContextDetailComponent } from "./app/features/game-designer/tab-contexts/game-context-detail/game-context-detail.component";
import { GameContextDetailEditComponent } from './app/features/game-designer/tab-contexts/game-context-detail-edit/game-context-detail-edit.component';
import { GameDialogueComponent } from './app/features/game-designer/tab-contexts/game-dialogue/game-dialogue.component';

const oktaAuth = new OktaAuth({
  issuer: 'https://dev-06013860.okta.com/oauth2/default',
  clientId: '0oa4qzcrfhN9zrhVp5d7',
  redirectUri: window.location.origin + '/login/callback'
});

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    GameComponent,
    HomeComponent,
    PlayDemoAvatarComponent,
    PlayDemoComponent,
    PlayComponent,
    SafePipe,
    DialogContentExampleDialog,
    MessageErrorToastComponent,
    MessageWarningToastComponent,
    MessageSuccessToastComponent,
    GameEditorComponent,
    GameDetailEditComponent,
    GameCreateDialogComponent,
    GameRoomDetailComponent,
    GameRoomDetailEditComponent,
    GameRoomDetailSelectDialogComponent,
    GameRoomDetailCanvasComponent,
    GameCharacterDetailEditComponent,
    GameDetailEditFinalConfigurationComponent,
    GameRoomDetailCreateCustomRoomDialogComponent,
    GameContextDetailComponent,
    GameContextDetailEditComponent,
    GameDialogueComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OktaAuthModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatDividerModule,
    MatDialogModule,
    MatTabsModule,
    MatStepperModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSnackBarModule,
    MatTooltipModule,
    ClipboardModule,
  ],
  providers: [
    {
      provide: OKTA_CONFIG, useValue: { oktaAuth }
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
