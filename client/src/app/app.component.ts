import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlashcardListComponent } from './components/flashcard-list/flashcard-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FlashcardListComponent],
  styleUrls: ['./app.component.css'], // ✅ Corrected key
  template: `<app-flashcard-list></app-flashcard-list>`, // ✅ Inline usage is fine
})
export class AppComponent {
  title = 'client';
}
