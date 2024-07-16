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

    contexts!: Context[];
    selectedContext!: Context[];
    compareContextsFunction = (c1: any, c2: any) => c1.id === c2.id;
    //@Output() contextsChange = new EventEmitter<Context[]>();

    createNewContext = false;

    @Input() characters!: Character[];
    selectedCharacter!: Character;
    compareCharactersFunction = (c1: Character, c2: Character) => c1.id === c2.id;
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
            console.log("contexts created", this.contexts, context);
        } else {
            this.contexts[i] = context;
            console.log("contexts updated", this.contexts, context);
        }
        console.log("Updated Context: ", this.selectedCharacter, this.contexts)
        this.getContextsOfCharacter(this.selectedCharacter);

        this.createNewContext = false;

        this.selectedContext = [context];
        console.log("Selected Context: ", this.selectedContext)
    }

    deletedContext(context: Context) {
        let i = this.contexts.findIndex(c => {
            return c.id === context.id;
        })

        console.log("Deleting Context: ", context, i)
        if (i !== -1) {
            this.contexts.splice(i, 1);
            console.log("Deleted Context: ", this.selectedCharacter.contexts, this.contexts)
        } else {
            console.error("Context not found: ", context)
        }

        this.getContextsOfCharacter(this.selectedCharacter);

        this.selectedContext = [];
    }

    private getContextsOfCharacter(character: Character): void {
        this.gameService.getContextsOfCharacter(character.id)
            .subscribe((characterContexts: Context[]) => {
                console.log(`Fetched Character Contexts : `, characterContexts);
                this.selectedCharacter.contexts = characterContexts;
                    if (this.selectedCharacter.contexts && this.selectedCharacter.contexts.length > 0) {
                        this.selectedContext = [this.selectedCharacter.contexts[0]];
                    }
            });
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

    onChangeCharacter($character: Character) {
        this.selectedCharacter = $character;
        this.createNewContext = false;
        this.getContextsOfCharacter(this.selectedCharacter)
        console.log(`Selected ${this.selectedCharacter.name}: `, this.selectedCharacter);
    }

    private getContextsFromCharactersInGame(id: string) {
        this.contexts = [];
        this.gameService.getCharactersInGame(id)
            .subscribe((characters: Character[]) => {
                this.characters = characters;
                console.log("Characters: ", characters)
                for (const character of characters) {
                    if (character.contexts && character.contexts.length > 0) {
                        for (const context of character.contexts) {
                           this.contexts.push(context);
                        }
                    }
                }

                if (this.characters && this.characters.length > 0) {
                    this.selectedCharacter = this.characters[0]; // Set the selected character to the first character
                    this.getContextsOfCharacter(this.selectedCharacter);
                    console.log(`Fetched Selected ${this.selectedCharacter.name}: `, this.selectedCharacter);
                    //this.characterChange.emit(this.selectedCharacter);
                }
                console.log(`Fetched Contexts : `, this.contexts);
            });
    }
}
