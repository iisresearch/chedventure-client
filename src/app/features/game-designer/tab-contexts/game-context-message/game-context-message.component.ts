import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Context, Message} from "../../../../core/models/game";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {GameService} from "../../../../core/game.service";

@Component({
    selector: 'app-game-context-message',
    templateUrl: './game-context-message.component.html',
    styleUrl: './game-context-message.component.css'
})
export class GameContextMessageComponent implements OnInit, OnChanges {
    @Input() messages!: Message[];
    @Input() selectedContext!: Context;
    @Output() messageChange = new EventEmitter<Message>();

    messageForm: FormGroup = new FormGroup({
        botMessage: new FormControl("",),
        userMessage: new FormControl("",),
    });

    updateForm: FormGroup = new FormGroup({
        messages: new FormArray([])
    })

    isEditing: boolean = false;

    constructor(private gameService: GameService) {
    }

    ngOnInit(): void {
    }

    ngOnChanges() {
        // Update the messages form array when the selectedContext changes
        if (this.selectedContext && this.isEditing) {
            console.log("Populating form array", this.selectedContext);
            this.populateFormArray();
        }
    }

    get botMessage() {
        return this.messageForm.get('botMessage');
    }

    get userMessage() {
        return this.messageForm.get('userMessage');
    }

    get messagesFormArray() {
        return this.updateForm.get('messages') as FormArray;
    }

    addMessage() {
        const newMessage: Message = {
            intent: this.messages.length,
            response: this.botMessage?.value,
            utterance: this.userMessage?.value,
        };
        this.messageForm.reset({
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
        this.gameService.deleteMessage(message.intent)
            .subscribe(result => {
                    this.messagesFormArray.removeAt(index);
                    this.deletedMessage(message);
                    console.log("Deleted message: ", result);
                }
            );
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (this.isEditing) {
            this.populateFormArray();
        }
    }

    /**
     * Is called from child component 'game-context-message' when a message has been updated/added.
     * @param message
     */
    updatedMessage(message: Message) {
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

    deletedMessage(message: Message) {
        let i = this.selectedContext.messages.findIndex(msg => {
            return msg.intent === message.intent;
        })
        if (i !== -1) {
            this.selectedContext.messages.splice(i, 1);
        }
    }

    populateFormArray() {
        const messagesArray = this.updateForm.get('messages') as FormArray;
        messagesArray.clear();
        this.messages.forEach(message => {
            messagesArray.push(new FormGroup({
                botMessage: new FormControl(message.response),
                userMessage: new FormControl(message.utterance),
            }));
        });
    }
}
