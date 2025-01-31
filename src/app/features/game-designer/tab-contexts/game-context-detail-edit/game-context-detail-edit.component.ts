import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Character, Context, Game, Message} from "../../../../core/models/game";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {GameService} from "../../../../core/game.service";

@Component({
    selector: 'app-game-context-detail-edit',
    templateUrl: './game-context-detail-edit.component.html',
    styleUrl: './game-context-detail-edit.component.css'
})
export class GameContextDetailEditComponent implements OnInit, OnChanges {
    @Input() game!: Game;

    @Input() selectedContext!: Context;
    @Output() updatedContext = new EventEmitter<Context>();
    @Output() deletedContext = new EventEmitter<Context>();

    @Input() createNewContext!: boolean;

    @Input() selectedCharacter!: Character;

    contextForm: FormGroup = new FormGroup({});

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {
    }

    ngOnChanges() {
        console.log("selectedCharacter: ", this.selectedCharacter)
        if (this.selectedContext && this.selectedCharacter && !this.createNewContext) {
            this.setupForm();
        } else {
            this.selectedContext = {
                id: -1,
                name: "",
                messages: [],
            };
            this.setupForm();
        }
    }

    get id() {
        return this.contextForm.get('id');
    }

    get name() {
        return this.contextForm.get('name');
    }

    get messagesToContext() {
        return this.contextForm.get('messagesToContext') as FormArray;
    }

    setupForm() {
        this.contextForm = new FormGroup({
            name: new FormControl(this.selectedContext.name, [Validators.required]),
            //prompt: new FormControl(this.context.prompt),
            messagesToContext: new FormArray([]),
        });
        console.log("messages", this.selectedContext.messages)
        this.selectedContext.messages!.forEach(message => {
            this.messagesToContext.push(new FormGroup({
                intent: new FormControl(message.intent),
                utterance: new FormControl(message.utterance),
                response: new FormControl(message.response),
                continuation: new FormControl(message.continuation),
                contextualisation: new FormControl(message.contextualisation),
            }));
        });

        console.log("contextForm: ", this.contextForm)
        console.log("messagesToContext: ", this.messagesToContext)
    }

    onSubmit() {
        console.log("onSubmit " + this.contextForm.valid);
        if (this.contextForm.valid) {
            let contextToSend: Context = {
                id: this.selectedContext.id,
                name: this.name?.value,
                //character: this.selectedCharacter,
                messages: this.selectedContext.messages,
            }
            console.log("contextToSend: ", contextToSend);
            // If a new Context is being created, send POST Request
            if (this.createNewContext) {
                console.log("Create context for Character: ", contextToSend);
                this.gameService
                    .createContext(this.selectedCharacter.id, contextToSend)
                    .subscribe(context => {
                        //this.selectedContext = context;
                        console.log("Context Created ", context);
                        this.updatedContext.emit(context);
                    })
            } else {
                // Send PUT request to update context to API
                console.log("Update context for Character: ", this.selectedCharacter)
                this.gameService
                    .updateContext(this.selectedContext.id, contextToSend)
                    .subscribe(context => {
                        //this.selectedContext = context;
                        console.log("Context Updated ", context);
                        this.updatedContext.emit(context);
                    })
            }
        }
    }

    deleteContext() {
        if (this.selectedContext?.id && !this.createNewContext) {
            if (confirm("Are you sure you want to delete this context?")) {
                this.gameService.deleteContext(this.selectedContext.id)
                    .subscribe(result => {
                        console.log("ContextDeleted ", result);
                        this.deletedContext.emit(this.selectedContext);
                    })
            }
        }
    }

}
