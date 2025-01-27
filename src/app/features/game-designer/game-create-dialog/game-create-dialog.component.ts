import { Component, OnInit } from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {GameService} from "../../../core/game.service";
import {Game} from "../../../core/models/game";
import {MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-game-create-dialog',
  templateUrl: './game-create-dialog.component.html',
  styleUrls: ['./game-create-dialog.component.css']
})
export class GameCreateDialogComponent implements OnInit {

  gameForm!: UntypedFormGroup;

  constructor(private gameService: GameService, public dialogRef: MatDialogRef<GameCreateDialogComponent>) {
    this.gameForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required]),
      subtitle: new UntypedFormControl(''),
      author: new UntypedFormControl('', [Validators.required]),
      version: new UntypedFormControl('1.0', [Validators.required])
    })
  }

  ngOnInit(): void {

  }

  get name() { return this.gameForm.get('name'); }
  get subtitle() { return this.gameForm.get('subtitle'); }
  get author() { return this.gameForm.get('author'); }
  get version() { return this.gameForm.get('version'); }

  onSubmit() {
    if (this.gameForm.valid) {
      let newGame = new Game("", this.name!.value, this.subtitle?.value, this.author!.value, this.version!.value, undefined, undefined, undefined, undefined, false)
      this.gameService
        .addGame(newGame)
        .subscribe(game => {
          console.log(game)
          if (game && game.id) {
            this.dialogRef.close(game.id);
          }
        });
    }
  }

}
