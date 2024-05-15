import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Message} from "../../../../core/models/game";
import {FormGroup} from "@angular/forms";

@Component({
    selector: 'app-game-context-message',
    templateUrl: './game-context-message.component.html',
    styleUrl: './game-context-message.component.css'
})
export class GameContextMessageComponent implements OnInit {
    @Input() messages!: Message[];
    @Output() messageChange = new EventEmitter<Message>();
    @Input() contextForm!: FormGroup;

    constructor() {
    }

    ngOnInit(): void {
    }

    addMessage(botMessage: string, userMessage: string) {
        const newMessage: Message = {
            intent: this.messages.length,
            utterance: botMessage,
            response: userMessage,
        };
        console.log("newMessage: ", newMessage);
        //addMessage(newMessage);
        this.messageChange.emit(newMessage);
    }

}
