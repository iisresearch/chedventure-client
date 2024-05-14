import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Character, Context, Message, Game} from "../../../../core/models/game";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
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

    messages!: Message[];

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {

    }

    ngOnChanges() {
        console.log("selectedCharacter: ", this.selectedCharacter)
        console.log("All Characters: ", this.characters)
        if (this.context && !this.createNewContext) {
            this.setupForm();
        } else {
            this.context = {
                id: -1,
                name: "",
                //prompt: [],
                messages: [],
            };
            this.messages = this.context.messages;
            this.setupForm();
        }
    }

    get name() { return this.contextForm.get('name') }

    //get prompt() { return this.contextForm.get('prompt') }

    //get messages() { return this.contextForm.get('messages') }

    setupForm() {
        this.contextForm = new FormGroup({
            name: new FormControl(this.context.name, [Validators.required]),
            //prompt: new FormControl(this.context.prompt),
            messages: new FormArray(this.context.messages.map(message => new FormGroup({
                //intent: new FormControl(message.intent),
                utterance: new FormControl(message.utterance),
                response: new FormControl(message.response),
            }))),
        });
    }

    onSubmit() {
        console.log("onSubmit " + this.contextForm.valid);
        if (this.contextForm.valid) {
            let contextToSend: Context = {
                id: this.context.id,
                name: this.name?.value,
                //prompt: this.prompt?.value,
                messages: this.messages,
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

    addMessage(newMessage: Message) {
        this.messages.push(newMessage);
    }

    /**
     * Is called from child component 'game-context-message' when a message has been updated/added.
     * @param message
     */
    updateMessage(message: Message) {

        let i = this.messages.findIndex(msg => {
            return msg.intent === message.intent;
        })
        if (i === -1) {
            this.messages.push(message);
        } else {
            this.messages[i] = message;
        }
        //this.dialoguesChange.emit(this.dialogues);
    }
}
