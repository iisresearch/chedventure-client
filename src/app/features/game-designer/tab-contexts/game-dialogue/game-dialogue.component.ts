import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GameService} from "../../../../core/game.service";
import {Character, Dialog} from "../../../../core/models/game";

@Component({
    selector: 'app-game-dialogue',
    templateUrl: './game-dialogue.component.html',
    styleUrl: './game-dialogue.component.css'
})
export class GameDialogueComponent implements OnInit {

    DIALOGUE: Dialog[] = [
        {
            id: 1,
            utterance: 'Hello, im bot!',
            response: 'Hi there, im user!'
        },
        {
            id: 2,
            utterance: 'How are you?',
            response: 'I am fine, thank you!'
        },
        {
            id: 3,
            utterance: 'What is your name?',
            response: 'My name is bot!'
        },
        {
            id: 4,
            utterance: 'What is your favorite color?',
            response: 'My favorite color is blue!'
        },
        {
            id: 5,
            utterance: 'What is your favorite food?',
            response: 'My favorite food is pizza!'
        },

    ];

    constructor(gameService: GameService) {
    }

    ngOnInit(): void {
    }

    addMessage(botMessage: string, userMessage: string) {
        const newDialog: Dialog = {
            id: this.DIALOGUE.length + 1,
            utterance: botMessage,
            response: userMessage,
        };
        this.DIALOGUE.push(newDialog);
    }

}
