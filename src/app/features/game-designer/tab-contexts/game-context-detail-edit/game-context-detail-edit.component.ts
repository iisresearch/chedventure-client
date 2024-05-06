import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Character, Context, Dialogue, Game} from "../../../../core/models/game";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GameService} from "../../../../core/game.service";
import {MatSelectChange} from "@angular/material/select";

@Component({
    selector: 'app-game-context-detail-edit',
    templateUrl: './game-context-detail-edit.component.html',
    styleUrl: './game-context-detail-edit.component.css'
})
export class GameContextDetailEditComponent implements OnInit, OnChanges {
    @Input() game!: Game;

    @Input() context!: Context;
    @Output() updatedContext = new EventEmitter<Context>();
    @Output() deletedContext = new EventEmitter<Context>();

    @Input() createNewContext!: boolean;

    @Input() characters!: Character[];
    @Input() selectedCharacter!: Character;

    contextForm!: FormGroup;
    prompts: string[] = ['None', 'Utterance', 'Continuation'];

    dialogues!: Dialogue[];

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {

    }

    ngOnChanges() {
        console.log("selectedCharacter: ", this.selectedCharacter)
        console.log("AllCharacters: ", this.characters)
        if (this.context && !this.createNewContext) {
            this.setupForm();
        } else {
            this.context = {
                id: -1,
                name: "",
                prompt: [],
                dialogues: [],
            };
            this.dialogues = this.context.dialogues;
            this.setupForm();
        }
    }

    get name() { return this.contextForm.get('name') }

    get prompt() { return this.contextForm.get('prompt') }

    //get dialogues() { return this.contextForm.get('dialogues') }

    setupForm() {
        this.contextForm = new FormGroup({
            name: new FormControl(this.context.name, [Validators.required]),
            prompt: new FormControl(this.context.prompt),
            dialogue: new FormControl(this.context.dialogues),
        })
    }

    onSubmit() {
        console.log("onSubmit " + this.contextForm.valid);
        if (this.contextForm.valid) {
            let contextToSend: Context = {
                id: this.context.id,
                name: this.name?.value,
                prompt: this.prompt?.value,
                dialogues: this.dialogues,
            }

            // If a new Context is being created, send POST Request
            if (this.createNewContext) {
                console.log(this.selectedCharacter);
                this.gameService
                    .createContext(this.selectedCharacter.id, contextToSend)
                    .subscribe(context => {
                        this.context = context;
                        this.updatedContext.emit(this.context);
                        console.log("ContextCreated " + contextToSend);
                    })

            } else {
                // Send PUT request to update context to API
                this.gameService
                    .updateContext(this.context.id, contextToSend)
                    .subscribe(context => {
                        this.context = context;
                        this.updatedContext.emit(this.context);
                        console.log("ContextUpdated " + contextToSend);
                    })

            }
        }
    }

    deleteContext() {
        if (this.context?.id && !this.createNewContext) {
            if (confirm("Are you sure you want to delete this context?")) {
                this.gameService
                    .deleteContext(this.context.id)
                    .subscribe(result => {
                        this.deletedContext.emit(this.context);
                    })
            }
        }
    }

    onPromptChange($event: MatSelectChange) {
        // This changes the form based on the prompt selected
        // if it's not utternace than disable the utterance form

        // if(this.prompt?.value!=="Utterance")
        //   this.utterance?.disable();
        // else this.utterance?.enable()
    }

    addDialogue(newDialogue: Dialogue) {
        this.dialogues.push(newDialogue);
    }

    /**
     * Is called from child component 'game-dialogue' when a dialogue has been updated/added.
     * @param dialogue
     */
    updateDialogue(dialogue: Dialogue) {

        let i = this.dialogues.findIndex(obj => {
            return obj.id === dialogue.id;
        })
        if (i === -1) {
            this.dialogues.push(dialogue);
        } else {
            this.dialogues[i] = dialogue;
        }
        //this.dialoguesChange.emit(this.dialogues);
    }
}
