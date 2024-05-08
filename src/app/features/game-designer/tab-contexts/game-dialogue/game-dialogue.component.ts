import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Message} from "../../../../core/models/game";

@Component({
    selector: 'app-game-dialogue',
    templateUrl: './game-dialogue.component.html',
    styleUrl: './game-dialogue.component.css'
})
export class GameDialogueComponent implements OnInit {
    @Input() messages!: Message[];
    @Output() messageChange = new EventEmitter<Message>();

    constructor() {
    }

    ngOnInit(): void {
    }

    addDialogue(botMessage: string, userMessage: string) {
        const newMessage: Message = {
            id: this.messages.length + 1,
            utterance: botMessage,
            response: userMessage,
        };
        this.messageChange.emit(newMessage);
    }

}
