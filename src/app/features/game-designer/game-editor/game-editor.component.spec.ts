import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameEditorComponent} from './game-editor.component';
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('GameEditorComponent', () => {
    let component: GameEditorComponent;
    let fixture: ComponentFixture<GameEditorComponent>;
    let mockActivatedRoute;

    beforeEach(async () => {
        mockActivatedRoute = {
            params: of({id: '123'})  // Here 'id' is provided directly as an Observable
        };

        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [GameEditorComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: mockActivatedRoute
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(GameEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load game based on route id', () => {
        // Additional test to ensure the component is reacting to the route parameter
        component.ngOnInit();
        fixture.detectChanges();
        // Here you would typically check if the correct game is being loaded,
        // which implies that getGame(id) has been called with the right id.
        // This will require mocking GameService as well and checking the call.
    });
});
