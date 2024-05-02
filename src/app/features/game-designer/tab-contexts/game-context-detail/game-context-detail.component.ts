import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Character, Context, Game} from "../../../../core/models/game";
import {GameService} from "../../../../core/game.service";
import {MatSelectionListChange} from "@angular/material/list";

@Component({
  selector: 'app-game-context-detail',
  standalone: false,
  templateUrl: './game-context-detail.component.html',
  styleUrl: './game-context-detail.component.css'
})
export class GameContextDetailComponent implements OnInit {

  @Input() game!: Game;
  @Output() gameChange = new EventEmitter<Game>();

  contexts: Context[] = [{id: 1, name: 'context1', prompt: [], utterance: 'utterance1', response: 'response1'}];
  selectedContext!: Context[];
  compareContextsFunction = (o1: any, o2: any) => o1.id === o2.id;
  @Output() contextsChange = new EventEmitter<Context[]>();

  createNewContext = false;

  @Input() characters!: Character[];
  selectedCharacter!: Character[];

  //compareCharactersFunction = (o1: any, o2: any)=> o1.id===o2.id;
  constructor(private gameService: GameService) {

  }

  ngOnInit(): void {
    this.getCharactersInGame(this.game.id);
    this.getContextsInGame(this.game.id);


    //this.getCharactersInGame(this.game.id);
  }

  updatedContext(context: Context) {
    let i = this.contexts.findIndex(obj => {
      return obj.id === context.id;
    })
    if (i === -1) {
      this.contexts.push(context);
    } else {
      this.contexts[i] = context;
    }
    this.selectedContext = [context];
    this.createNewContext = false;
  }

  deletedContext(context: Context) {
    let i = this.contexts.findIndex(obj => {
      return obj.id === context.id;
    })
    if (i !== -1) {
      this.contexts.splice(i, 1);
    }
    this.selectedContext = [];

  }

  contextIsSelected(context: Context): boolean {
    if (this.selectedContext && this.selectedContext.length !== 0 && context) {
      return this.compareContextsFunction(context, this.selectedContext[0].id);
    } else {
      return false;
    }
  }

  onChangeContext(change: MatSelectionListChange) {
    this.createNewContext = false;
  }

  createContext() {
    this.createNewContext = true;
    this.selectedContext = [];
  }

  getCharactersInGame(id: string) {
    this.gameService.getCharactersInGame(id)
      .subscribe(characters => {
        this.characters = characters;
      });
  }

  // characterIsSelected(character: Character): boolean {
  //   if (this.selectedCharacter && this.selectedCharacter.length !== 0 && character) {
  //     return this.compareCharactersFunction(character, this.selectedCharacter[0].id);
  //   } else {
  //     return false;
  //   }
  // }

  private getContextsInGame(id: string) {
    this.gameService.getContextsInGame(id)
      .subscribe((contexts: Context[]) => {
        this.contexts = contexts;
        this.contextsChange.emit(this.contexts);
      });
  }
}
