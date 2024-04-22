import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import {OktaAuthStateService} from "@okta/okta-angular";
import {of} from "rxjs";


describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    const mockOktaAuthStateService = {
      authState$: of({ isAuthenticated: true, user: { name: 'Test User' } })  // Adjust this as necessary for your tests
    };
    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      providers: [
        { provide: OktaAuthStateService, useValue: mockOktaAuthStateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
