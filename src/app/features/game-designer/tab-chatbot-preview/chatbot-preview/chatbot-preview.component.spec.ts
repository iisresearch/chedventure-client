import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChatbotPreviewComponent} from './chatbot-preview.component';

describe('ChatbotPreviewComponent', () => {
  let component: ChatbotPreviewComponent;
  let fixture: ComponentFixture<ChatbotPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatbotPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatbotPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
