    import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
    import {Message} from "../../../../core/models/game";
    import {AbstractControl, Form, FormArray, FormControl, FormGroup} from "@angular/forms";

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
            botMessage: new FormControl("",),
            userMessage: new FormControl("",),
        });

        updateForm: FormGroup = new FormGroup({
            messages: new FormArray([])
        })

        isEditing: boolean = false;

        constructor() {
        }

        ngOnInit(): void {
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
            //addMessage(newMessage);
            this.messageChange.emit(newMessage);
        }

        updateMessage(index: number) {
            // Log the form group values for debugging
            const messageFormGroup = this.messagesFormArray.at(index) as FormGroup;
            const updatedMessage: Message = {
                intent: -1,
                response: messageFormGroup.get('botMessage')?.value,
                utterance: messageFormGroup.get('userMessage')?.value,
            };
            this.messageChange.emit(updatedMessage);
            console.log("updateMessage: ", updatedMessage);
            //this.toggleEdit();
        }

        toggleEdit() {
            this.isEditing = !this.isEditing;
            if (this.isEditing) {
                this.populateFormArray();
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
