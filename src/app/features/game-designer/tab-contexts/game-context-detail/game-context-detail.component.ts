import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Character, Context, Game} from "../../../../core/models/game";
import {GameService} from "../../../../core/game.service";
import {MatSelectionListChange} from "@angular/material/list";
import {MatSelectChange} from "@angular/material/select";

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
  compareCharacterToGameFunction = (c1: any, c2: any)=> c1.id===c2.id;
  @Output() charactersChange = new EventEmitter<Character>();

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    this.getCharactersInGame(this.game.id);
    this.getContextsInGame(this.game.id);
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
        // Set to the first character by default
        if(this.characters && this.characters.length > 0){
          this.selectedCharacter = this.characters[0]; // Set the selected character to the first character
          console.log(`Fetched Selected ${this.selectedCharacter.name}: `, this.selectedCharacter);
          this.charactersChange.emit(this.selectedCharacter);
        }
      });
  }

  onChangeCharacter($event: MatSelectChange) {
    this.selectedCharacter = $event.value;
    console.log(`Selected ${this.selectedCharacter.name}: `, this.selectedCharacter);
  }

  private getContextsInGame(id: string) {
    this.gameService.getContextsInGame(id)
      .subscribe((contexts: Context[]) => {
        this.contexts = contexts;
        console.log(`Fetched Contexts ${this.selectedCharacter.name}: `, this.contexts);
        this.contextsChange.emit(this.contexts);
      });
  }
}
