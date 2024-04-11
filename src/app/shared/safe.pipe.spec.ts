import { TestBed } from '@angular/core/testing';
import { SafePipe } from './safe.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafePipe', () => {
  let pipe: SafePipe;

  beforeEach(() => {
    const domSanitizer = TestBed.inject(DomSanitizer);
    pipe = new SafePipe(domSanitizer);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
