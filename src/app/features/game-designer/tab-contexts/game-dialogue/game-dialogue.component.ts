import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Dialogue} from "../../../../core/models/game";

@Component({
    selector: 'app-game-dialogue',
    templateUrl: './game-dialogue.component.html',
    styleUrl: './game-dialogue.component.css'
})
export class GameDialogueComponent implements OnInit {
    @Input() dialogues!: Dialogue[];
    @Output() dialogueChange = new EventEmitter<Dialogue>();

    constructor() {
    }

    ngOnInit(): void {
    }

    addDialogue(botMessage: string, userMessage: string) {
        const newDialogue: Dialogue = {
            id: this.dialogues.length + 1,
            utterance: botMessage,
            response: userMessage,
        };
        this.dialogueChange.emit(newDialogue);
    }

}
