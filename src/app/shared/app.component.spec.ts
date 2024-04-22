import {ComponentFixture, TestBed} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {OKTA_CONFIG, OktaAuthModule, OktaAuthStateService} from "@okta/okta-angular";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import { OktaAuth } from '@okta/okta-auth-js';
import { MatMenuModule } from '@angular/material/menu';  // Import MatMenuModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Often required when testing Material components

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let oktaAuth: OktaAuth;

  beforeEach(async () => {
    oktaAuth = new OktaAuth({
      issuer: 'https://{yourOktaDomain}/oauth2/default',
      clientId: '{clientId}',
      redirectUri: window.location.origin + '/callback'
    });

    await TestBed.configureTestingModule({
      imports: [
        MatMenuModule,
        BrowserAnimationsModule,
        OktaAuthModule
      ],
      declarations: [AppComponent],
      providers: [
        { provide: OKTA_CONFIG, useValue: { oktaAuth } },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ChEdventure'`, () => {
    expect(app.title).toEqual('ChEdventure');
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('span')?.textContent).toContain('ChEdventure');
  });
});
