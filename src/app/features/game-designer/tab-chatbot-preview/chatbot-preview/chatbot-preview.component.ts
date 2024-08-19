import {Component, Input, OnInit} from '@angular/core';
import {Character, Game} from "../../../../core/models/game";
import {chatbotUrl, GameService} from "../../../../core/game.service";

@Component({
    selector: 'app-chatbot-preview',
    templateUrl: './chatbot-preview.component.html',
    styleUrl: './chatbot-preview.component.css'
})
export class ChatbotPreviewComponent implements OnInit {
    @Input() game!: Game;

    isChatbotRunning: boolean = false;
    
    selectedCharacter!: Character;
    @Input() characters!: Character[];

    constructor(private gameService: GameService) {}

    ngOnInit() {
        this.checkChatbotStatus();
        this.loadCharacters();
    }

    private loadCharacters() {
        if (!this.characters) {
            this.gameService.getCharactersInGame(this.game.id).subscribe((characters: Character[]) => {
                this.characters = characters;
                this.initializeChatbot();
            });
        } else {
            this.initializeChatbot();
        }
    }

    // Initialize chatbot iframe and widget
    private initializeChatbot() {
        this.selectedCharacter = this.characters[0];
    }
    // Check Chatbot server status
    private checkChatbotStatus() {
        this.gameService.checkChatbotStatus().subscribe((status) => {
            this.isChatbotRunning = status;
        });
    }
}
