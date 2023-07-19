import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource} from "@angular/material/table";
import {baseUrlDomain, GameService} from "../../core/game.service";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as PIXI from "pixi.js";
import {DialogContentExampleDialog} from "../play/play/play.component";
import {MatDialog} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Game} from "../../core/models/game";
import {GameCreateDialogComponent} from "../game-designer/game-create-dialog/game-create-dialog.component";
import {Router} from "@angular/router";
import {Clipboard} from '@angular/cdk/clipboard';
import {MessageService} from "../../core/message.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  displayedColumns: string[] = ['name', 'subtitle', 'edit', 'play', 'copy', 'delete'];
  dataSource = new MatTableDataSource<any>();

  constructor(private gameService: GameService, private _snackBar: MatSnackBar, public dialog: MatDialog, private _router: Router, private clipboard: Clipboard) { }

  ngOnInit(): void {
    /*this.httpClient.get<any>('http://localhost:4201/games').subscribe(data => {
      console.log(data.total);
    })*/
    this.getGames()
  }

  getGames(): void {
    this.gameService.getGames()
      .subscribe(games => this.dataSource.data = games);
  }

  playGame(id: number) {
    window.open("/play/"+id, "_blank")
  }

  editGame(id: string) {
    this._router.navigateByUrl("/game-editor/"+id);
  }

  copyToClipboard(game: Game) {
    if (game.isPublished) {
      this.clipboard.copy(baseUrlDomain+ "/play/" +game.id);
      this._snackBar.open("Copied game-URL to clipboard", "Close", {
        duration: 4 * 1000,
      });
    } else {
      this._snackBar.open("Game is not published yet and can't be copied to clipboard", "Close", {
        duration: 4 * 1000,
      });
    }
  }

  deleteGame(id: string) {
    if(confirm("Are you sure you want to delete this game?")) {
      this.gameService.deleteGame(id)
        .subscribe(result => {
          this.getGames();
        })
    }

  }

  openCreateNewGameDialog() {
    const dialogRef = this.dialog.open(GameCreateDialogComponent, {
      height: '450px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== "" && result) {
        let id = String(result);
        this.editGame(id);
      }
    });
  }

}
