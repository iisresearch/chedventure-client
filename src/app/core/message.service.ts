import {Component, Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {MatSnackBar} from "@angular/material/snack-bar";

export interface IMessage {
  text?: string;
}

export enum MessageStatus {
  Error,
  Success,
  Warning,
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  durationInSeconds = 4;
  message = "";

  constructor(private _snackBar: MatSnackBar) {}

  Show(text: string, status: MessageStatus) {
    this.message = text;

    switch (status) {
      case MessageStatus.Error:
        this._snackBar.openFromComponent(MessageErrorToastComponent, {
          panelClass: 'custom-snackbar-error',
          duration: this.durationInSeconds * 1000,
        });
        break;
      case MessageStatus.Success:
        this._snackBar.openFromComponent(MessageSuccessToastComponent, {
          panelClass: 'custom-snackbar-success',
          duration: this.durationInSeconds * 1000,
        });
        break;
      case MessageStatus.Warning:
        this._snackBar.open(text, "Close", {
          panelClass: 'custom-snackbar-warning',
        })
        /*this._snackBar.openFromComponent(MessageSuccessToastComponent, {
          panelClass: 'custom-snackbar-warning',
          duration: this.durationInSeconds * 1000,
        });*/
        break;
    }


  }

  Hide() {
    this._snackBar.dismiss();
  }
}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: `
    <span>{{messageService.message}}</span>
  `,
  styles: [``],
})
export class MessageErrorToastComponent {

  constructor(public messageService: MessageService) {
  }
}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: `
    <span>{{messageService.message}}</span>
  `,
  styles: [``],
})
export class MessageSuccessToastComponent {

  constructor(public messageService: MessageService) {
  }
}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: `
    <span>{{messageService.message}}</span>
  `,
  styles: [``],
})
export class MessageWarningToastComponent {

  constructor(public messageService: MessageService) {
  }
}

