import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardService } from '../../services/flashcard.service';
import { Flashcard } from '../../models/flashcard.model';

@Component({
  selector: 'app-flashcard-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flashcard-list.component.html',
})
export class FlashcardListComponent implements OnInit {
  flashcards: Flashcard[] = [];

  constructor(private flashcardService: FlashcardService) {}

  ngOnInit(): void {
    this.flashcardService.getFlashcards().subscribe((data) => {
      this.flashcards = data;
    });
  }
}
