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

    @Input() selectedContext!: Context;
    @Output() updatedContext = new EventEmitter<Context>();
    @Output() deletedContext = new EventEmitter<Context>();

    @Input() createNewContext!: boolean;

    @Input() characters!: Character[];
    @Input() selectedCharacter!: Character;

    contextForm: FormGroup = new FormGroup({
        // name: new FormControl(this.context.name, [Validators.required]),
        // //prompt: new FormControl(this.context.prompt),
        // messages: new FormArray([]),
    });

    //messages!: Message[];

    newMessageToContext(intent: number | undefined, utterance: string | undefined, response: string | undefined) {
        return new FormGroup({
            intent: new FormControl(intent),
            utterance: new FormControl(utterance),
            response: new FormControl(response),
        });
    }

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {
        //this.messages = this.context.messages;
    }

    ngOnChanges() {
        console.log("selectedCharacter: ", this.selectedCharacter)
        console.log("All Characters: ", this.characters)
        if (this.selectedContext && this.selectedCharacter && !this.createNewContext) {
            this.setupForm();
        } else {
            this.selectedContext = {
                id: -1,
                name: "",
                messages: [],
                character: this.selectedCharacter,
            };
            this.setupForm();
        }
    }

    get name() {
        return this.contextForm.get('name');
    }

    get messagesToContext() { return this.contextForm.get('messagesToContext') as FormArray; }

    setupForm() {
        this.contextForm = new FormGroup({
            name: new FormControl(this.selectedContext.name, [Validators.required]),
            //prompt: new FormControl(this.context.prompt),
            messagesToContext: new FormArray([]),
        });
        console.log("messages",this.selectedContext.messages)
        this.selectedContext.messages!.forEach(message => {
            let formGroupMessages = this.messagesToContext;
            let messageToContext = this.getMessageToContext(message.intent);

            formGroupMessages.push(this.newMessageToContext(messageToContext?.intent,
                messageToContext?.utterance,
                messageToContext?.response,))
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
                //prompt: this.prompt?.value,
                messages: this.selectedContext.messages,
                character: this.selectedCharacter,
            }

            // If a new Context is being created, send POST Request
            if (this.createNewContext) {
                console.log("Create context for Character: ",this.selectedCharacter);
                this.gameService
                    .createContext(this.selectedCharacter.id, contextToSend)
                    .subscribe(context => {
                        this.selectedContext = context;
                        this.updatedContext.emit(this.selectedContext);
                        console.log("ContextCreated " + contextToSend);
                    })

            } else {
                // Send PUT request to update context to API
                console.log("Update context for Character: ",this.selectedCharacter)
                this.gameService
                    .updateContext(this.selectedContext.id, contextToSend)
                    .subscribe(context => {
                        this.selectedContext = context;
                        this.updatedContext.emit(this.selectedContext);
                        console.log("ContextUpdated " + contextToSend);
                    })

            }
        }
    }

    deleteContext() {
        if (this.selectedContext?.id && !this.createNewContext) {
            if (confirm("Are you sure you want to delete this context?")) {
                this.gameService
                    .deleteContext(this.selectedContext.id)
                    .subscribe(result => {
                        console.log("ContextDeleted ", result);
                        this.deletedContext.emit(this.selectedContext);
                    })
            }
        }
    }


    /**
     * Is called from child component 'game-context-message' when a message has been updated/added.
     * @param message
     */
    updateMessage(message: Message) {

        let i = this.selectedContext.messages.findIndex(msg => {
            return msg.intent === message.intent;
        })
        console.log("i findIndex: ", i)
        if (i === -1) {
            this.selectedContext.messages.push(message);
        } else {
            this.selectedContext.messages[i] = message;
        }
        //this.dialoguesChange.emit(this.dialogues);
    }

    getMessageToContext(intent: number): Message|null {
        if(this.selectedContext.messages.length !== 0) {
            for (let messageToContext of this.selectedContext.messages) {
                if (messageToContext.intent === intent) {
                    return messageToContext;
                }
            }
        }
        return null
    }
}
