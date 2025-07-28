import { Component, OnInit } from '@angular/core';
import { FlashcardService } from '../../services/flashcard.service';
import { Flashcard } from '../../models/flashcard.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-flashcard-list',
  templateUrl: './flashcard-list.component.html',
  styleUrls: ['./flashcard-list.component.css'],
  imports: [CommonModule, FormsModule]
})
export class FlashcardListComponent implements OnInit {
  flashcards: Flashcard[] = [];
  newQuestion = '';
  newAnswer = '';

  constructor(private flashcardService: FlashcardService) {}

  ngOnInit() {
    this.loadFlashcards();
  }

  loadFlashcards() {
    this.flashcardService.getFlashcards().subscribe(cards => this.flashcards = cards);
  }

  addFlashcard() {
    if (!this.newQuestion.trim() || !this.newAnswer.trim()) return;
    const newFlashcard: Flashcard = {
      id: 0, // backend assigns id
      question: this.newQuestion,
      answer: this.newAnswer
    };
    this.flashcardService.createFlashcard(newFlashcard).subscribe(card => {
      this.flashcards.push(card);
      this.newQuestion = '';
      this.newAnswer = '';
    });
  }

  deleteFlashcard(id: number) {
    this.flashcardService.deleteFlashcard(id).subscribe(() => {
      this.flashcards = this.flashcards.filter(card => card.id !== id);
    });
  }
}
