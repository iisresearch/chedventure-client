import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Message} from "../../../../core/models/game";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-game-context-message',
    templateUrl: './game-context-message.component.html',
    styleUrl: './game-context-message.component.css'
})
export class GameContextMessageComponent implements OnInit {
    @Input() messages!: Message[];
    @Output() messageChange = new EventEmitter<Message>();
    //@Input() contextForm!: FormGroup;
    messageForm: FormGroup = new FormGroup({
        botMessage: new FormControl("", ),
        userMessage: new FormControl("", ),
    });


    constructor() {
    }

    ngOnInit(): void {
    }

    get botMessage() { return this.messageForm.get('botMessage'); }
    get userMessage() { return this.messageForm.get('userMessage'); }

    addMessage() {
        const newMessage: Message = {
            intent: this.messages.length,
            utterance: this.botMessage?.value,
            response: this.userMessage?.value,
        };

        this.messageForm.reset();
        console.log("newMessage: ", newMessage);
        //addMessage(newMessage);
        this.messageChange.emit(newMessage);
    }

}
