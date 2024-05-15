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
        if (this.context && this.selectedCharacter && !this.createNewContext) {
            this.setupForm();
        } else {
            this.context = {
                id: -1,
                name: "",
                //prompt: [],
                messages: [],
                character: this.selectedCharacter,
            };
            this.setupForm();
        }
    }

    get name() {
        return this.contextForm.get('name');
    }

    //get prompt() { return this.contextForm.get('prompt') }

    get messagesToContext() { return this.contextForm.get('messagesToContext') as FormArray; }

    setupForm() {
        this.contextForm = new FormGroup({
            name: new FormControl(this.context.name, [Validators.required]),
            //prompt: new FormControl(this.context.prompt),
            messagesToContext: new FormArray([]),
        });
        console.log("messages",this.context.messages)
        this.context.messages!.forEach(message => {
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
                id: this.context.id,
                name: this.name?.value,
                //prompt: this.prompt?.value,
                messages: this.context.messages,
                character: this.selectedCharacter,
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
                        console.log("ContextDeleted ", result);
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

    /**
     * Is called from child component 'game-context-message' when a message has been updated/added.
     * @param message
     */
    updateMessage(message: Message) {

        let i = this.context.messages.findIndex(msg => {
            return msg.intent === message.intent;
        })
        console.log("i findindex: ", i)
        if (i === -1) {
            this.context.messages.push(message);
        } else {
            this.context.messages[i] = message;
        }
        //this.dialoguesChange.emit(this.dialogues);
    }

    getMessageToContext(intent: number): Message|null {
        if(this.context.messages.length !== 0) {
            for (let messageToContext of this.context.messages) {
                if (messageToContext.intent === intent) {
                    return messageToContext;
                }
            }
        }
        return null
    }
}
