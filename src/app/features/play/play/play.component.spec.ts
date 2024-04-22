import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlayComponent} from './play.component';
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {OktaAuthStateService} from '@okta/okta-angular';



describe('PlayComponent', () => {
    let component: PlayComponent;
    let fixture: ComponentFixture<PlayComponent>;
    let mockOktaAuthStateService: any;

    beforeEach(async () => {
        // Create a mock instance of OktaAuthStateService
        mockOktaAuthStateService = {
            isAuthenticated$: of(true),  // Example: Assume the user is always authenticated
            getUser: () => Promise.resolve({name: 'Test User'})  // Example user data
        };

        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],  // Include HttpClientTestingModule here
            declarations: [PlayComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({id: 123}), // Mocking ActivatedRoute with a parameter map
                    },
                },
                { provide: OktaAuthStateService, useValue: mockOktaAuthStateService }
                ]
        }).compileComponents();

        fixture = TestBed.createComponent(PlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
