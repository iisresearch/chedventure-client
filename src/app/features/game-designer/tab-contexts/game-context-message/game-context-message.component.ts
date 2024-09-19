import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Character, Context, Message} from "../../../../core/models/game";
import {Form, FormArray, FormControl, FormGroup} from "@angular/forms";
import {GameService} from "../../../../core/game.service";
import {MatSelectChange} from "@angular/material/select";

@Component({
    selector: 'app-game-context-message',
    templateUrl: './game-context-message.component.html',
    styleUrl: './game-context-message.component.css'
})
export class GameContextMessageComponent implements OnInit, OnChanges {
    messages!: Message[];
    @Input() selectedContext!: Context;
    @Input() selectedCharacter!: Character; // Used for contextualisation and continuation
    @Output() messagesChange = new EventEmitter<Message[]>();

    addMessageForm: FormGroup = new FormGroup({
        botMessage: new FormControl("",),
        userMessage: new FormControl("",),
    });

    updateForm: FormGroup = new FormGroup({
        messages: new FormArray([])
    });

    // dialogFlowForm: FormGroup = new FormGroup({});

    isEditing: boolean = false;

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {
        console.log("selectedContext.messages: ", this.selectedContext.messages)
        this.updateForm = new FormGroup({
            messages: new FormArray([])
        });
        this.populateFormArray();
    }

    ngOnChanges() {
        if (!this.selectedContext || !this.selectedContext.messages) {
            console.error("Selected context or its messages are not available.");
            return;
        }
        // Update the messages form array when the selectedContext changes
        this.messages = this.selectedContext.messages;
        this.populateFormArray();
    }

    get botMessage() {
        return this.addMessageForm.get('botMessage');
    }

    get userMessage() {
        return this.addMessageForm.get('userMessage');
    }

    get messagesFormArray() {
        return this.updateForm.get('messages') as FormArray;
    }

    get contextualisation() {
        return this.updateForm.get('contextualisation') as FormControl;
    }

    get continuation() {
        return this.updateForm.get('continuation') as FormControl;
    }

    addMessage() {
        const newMessage: Message = {
            intent: -1,
            response: this.botMessage?.value,
            utterance: this.userMessage?.value,
        };
        this.addMessageForm.reset({
                botMessage: "",
                userMessage: "",
            }
        );
        console.log("newMessage: ", newMessage);
        this.updatedMessage(newMessage);
    }

    updateMessage(index: number, message: Message) {
        // Log the form group values for debugging
        const messageFormGroup = this.messagesFormArray.at(index) as FormGroup;
        const updatedMessage: Message = {
            intent: message.intent,
            utterance: messageFormGroup.get('userMessage')?.value,
            response: messageFormGroup.get('botMessage')?.value,
            continuation: messageFormGroup.get('continuation')?.value,
            contextualisation: messageFormGroup.get('contextualisation')?.value,
        };

        // this.messageChange.emit(updatedMessage);
        console.log("updateMessage: ", updatedMessage);
        this.gameService.updateMessage(message.intent, updatedMessage)
            .subscribe(updatedMessage => {
                this.updatedMessage(updatedMessage)
                console.log("Updated message: ", updatedMessage);
            });
    }

    deleteMessage(index: number, message: Message) {
        if (confirm("Are you sure you want to delete this message?")) {
            this.gameService.deleteMessage(message.intent)
                .subscribe(result => {
                        this.messagesFormArray.removeAt(index);
                        this.deletedMessage(message);
                        console.log("Deleted message: ", result);
                    }
                );
        }
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (this.isEditing && this.messages.length > 0) {
            this.populateFormArray();
        }
    }

    /**
     * Is called when a message has been added/updated.
     * @param message
     */
    updatedMessage(message: Message) {

        if (message.intent === -1) {
            this.messages.push(message);
        } else {
            let i = this.messages.findIndex(msg => {
                return msg.intent === message.intent;
            })
            console.log("i findIndex: ", i)
            this.messages[i] = message;
        }
        this.populateFormArray();
        // this.messagesChange.emit(this.messages);
    }

    deletedMessage(message: Message) {
        let i = this.messages.findIndex(msg => {
            return msg.intent === message.intent;
        })
        if (i !== -1) {
            this.messages.splice(i, 1);
        }
        this.populateFormArray();
        this.messagesChange.emit(this.messages);
    }

    populateFormArray() {
        const messagesArray = this.updateForm.get('messages') as FormArray;
        messagesArray.clear();
        this.messages.forEach(message => {
            const continuation = this.getContinuationFormValue(message);
            let contextualisation = undefined;
            if (message.contextualisation && message.contextualisation.length > 0)
                contextualisation = this.selectedContext.name;
            else
                contextualisation = this.selectedContext.name;
            console.log("Contextualisation: ", this.selectedContext)
            messagesArray.push(new FormGroup({
                botMessage: new FormControl(message.response),
                userMessage: new FormControl(message.utterance),
                continuation: new FormControl(continuation),
                contextualisation: new FormControl(contextualisation),
            }));
        });
        console.log("messagesArray: ", messagesArray)
    }

    getContinuationFormValue(message: Message) {
        let i = this.messages.findIndex(msg => msg.intent === message.intent)
        // Check if message and intent is present
        if (i === -1 || this.messages.length < 1) {
            console.error("Invalid index or message not found:", message);
            return 'await'; // or some other default value
        }
        // Gets next message from all contexts
        // Determine the next message intent based on the current context
        const nextMessage = (message.contextualisation === this.selectedContext.name)
            ? (this.messages[i + 1] || null) // next message in the same context
            : this.selectedCharacter?.contexts
            .find(ctx => ctx.name === message.contextualisation)
            ?.messages[0] || null; // first message of another context
        console.log("Next message: ", nextMessage)

        switch (message.continuation) {
            case '':
                return 'await';
            case nextMessage?.intent.toString():
                return 'next';
            default:
                console.log("Continuation not set: ", message);
                return 'await';
        }
    }

    onContinuationChange(message: Message, $event: MatSelectChange) {
        console.log("onContinuationChange: ", $event.value);
        const context = this.selectedCharacter?.contexts.find(ctx => ctx.name === message.contextualisation);

        const nextMessage = (context && context?.name !== this.selectedContext?.name)
            ? context?.messages[0] // first message of another context
            : this.messages[this.messages.findIndex(msg => msg.intent === message.intent) + 1]; // next message in the same context

        switch ($event.value) {
            case 'await':
                message.continuation = "";
                break;
            case 'next':
                console.log("Next message change: ", nextMessage);
                if (nextMessage)
                    message.continuation = nextMessage.intent.toString();
                else
                    message.continuation = '';
                break;
            default:
                this.continuation?.setValue($event.value);
        }
        this.updatedMessage(message);
    }

}
