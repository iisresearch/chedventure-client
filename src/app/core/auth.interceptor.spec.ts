import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {OKTA_AUTH} from "@okta/okta-angular";

describe('AuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      AuthInterceptor,
      {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
      },
      {
        provide: OKTA_AUTH, // This might be different based on your actual Okta setup
        useValue: {
          isAuthenticated: () => Promise.resolve(true),
          getAccessToken: () => Promise.resolve('fake-token')
        } // This is a simple mock that you might need to expand depending on usage
      }
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
