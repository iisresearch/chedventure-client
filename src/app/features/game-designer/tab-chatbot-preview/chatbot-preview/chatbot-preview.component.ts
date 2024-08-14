import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Character, Game} from "../../../../core/models/game";
import {chatbotURL, GameService} from "../../../../core/game.service";

@Component({
    selector: 'app-chatbot-preview',
    templateUrl: './chatbot-preview.component.html',
    styleUrl: './chatbot-preview.component.css'
})
export class ChatbotPreviewComponent implements OnInit {
    @Input() game!: Game;

    @ViewChild('chatbotFrame', {static: false}) chatbotFrame!: ElementRef;

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
        this.setIframeForChatbot(this.selectedCharacter.id);
        this.mountChainlitWidget(this.selectedCharacter.id);
    }
    // Check Chatbot server status
    private checkChatbotStatus() {
        this.gameService.checkChatbotStatus().subscribe((status) => {
            this.isChatbotRunning = status;
        });
    }

    setIframeForChatbot(agentId: number) {
        // Check if Chatbot is running
        const url = `${chatbotURL}?character_id=${agentId}`;
        if(!this.isChatbotRunning) {
            console.warn('Chatbot server is not available.');
            return;
        }
        if (this.chatbotFrame && this.chatbotFrame.nativeElement)
            this.chatbotFrame.nativeElement.src = url;
         else
            console.error("chatbotFrame is not defined");
    }

    mountChainlitWidget(agentId: number) {
        console.log('mountChainlitWidget' in window);
        if ('mountChainlitWidget' in window) {
            (window as any).mountChainlitWidget({
                chainlitServer: `${chatbotURL}/?character_id=${agentId}`,
                showCot: true, //Chain of Thought
            });
        }
    }
}