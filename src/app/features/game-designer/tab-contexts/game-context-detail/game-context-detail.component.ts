import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Character, Context, Game} from "../../../../core/models/game";
import {GameService} from "../../../../core/game.service";
import {MatSelectionListChange} from "@angular/material/list";
import {MatSelectChange} from "@angular/material/select";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-game-context-detail',
  standalone: false,
  templateUrl: './game-context-detail.component.html',
  styleUrl: './game-context-detail.component.css'
})
export class GameContextDetailComponent implements OnInit {

  @Input() game!: Game;
  @Output() gameChange = new EventEmitter<Game>();

  contexts!: Context[];
  selectedContext!: Context[];
  compareContextsFunction = (o1: any, o2: any) => o1.id === o2.id;
  @Output() contextsChange = new EventEmitter<Context[]>();

  createNewContext = false;

  @Input() characters!: Character[];
  selectedCharacter!: Character;
  compareCharacterToGameFunction = (c1: Character, c2: Character) => c1.id === c2.id;
  @Output() characterChange = new EventEmitter<Character>();

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    //this.getCharactersInGame(this.game.id);
    this.getContextsFromCharactersInGame(this.game.id);
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
      //console.log("Selected Context: ", this.selectedContext[0], " Context: ", context);
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

  // getCharactersInGame(id: string) {
  //   this.gameService.getCharactersInGame(id)
  //     .subscribe(characters => {
  //       this.characters = characters;
  //       // Set to the first character by default
  //       if(this.characters && this.characters.length > 0){
  //         this.selectedCharacter = this.characters[0]; // Set the selected character to the first character
  //         console.log(`Fetched Selected ${this.selectedCharacter.name}: `, this.selectedCharacter);
  //         this.characterChange.emit(this.selectedCharacter);
  //       }
  //     });
  // }

  onChangeCharacter($event: MatSelectChange) {
    this.selectedCharacter = $event.value;
    //this.characterChange.emit(this.selectedCharacter);
    console.log(`Selected ${this.selectedCharacter.name}: `, this.selectedCharacter);
  }

  private getContextsFromCharactersInGame(id: string) {
    this.contexts = [];
    this.gameService.getCharactersInGame(id)
        .subscribe((characters: Character[]) => {
          this.characters = characters;
          for (const character of characters) {
            if (character.contexts && character.contexts.length > 0) {
              for (const context of character.contexts) {
                this.contexts.push(context);
              }
            }
          }

          if (this.characters && this.characters.length > 0){
              this.selectedCharacter = this.characters[0]; // Set the selected character to the first character
              console.log(`Fetched Selected ${this.selectedCharacter.name}: `, this.selectedCharacter);
              this.characterChange.emit(this.selectedCharacter);
          }
          if (this.contexts && this.contexts.length > 0){
            this.contextsChange.emit(this.contexts);
            console.log(`Fetched Contexts : `, this.contexts);

          }
        });
  }
}
