import { Component, OnInit } from '@angular/core';
import { FlashcardService } from '../../services/flashcard.service';
import { Flashcard } from '../../models/flashcard.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flashcard-list',
  templateUrl: './flashcard-list.component.html',
  styleUrls: ['./flashcard-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FlashcardListComponent implements OnInit {
  flashcards: Flashcard[] = [];
  newQuestion = '';
  newAnswer = '';

  // For editing
  editingId: number | null = null;
  editedQuestion: string = '';
  editedAnswer: string = '';

  constructor(private flashcardService: FlashcardService) { }

  ngOnInit() {
    this.loadFlashcards();
  }

  loadFlashcards() {
    this.flashcardService.getFlashcards().subscribe(cards => {
      this.flashcards = cards;
    });
  }

  addFlashcard() {
    if (!this.newQuestion.trim() || !this.newAnswer.trim()) return;

    const newFlashcard: Flashcard = {
      id: 0, // Backend assigns ID
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

  startEditing(card: Flashcard) {
    this.editingId = card.id;
    this.editedQuestion = card.question;
    this.editedAnswer = card.answer;
  }

  cancelEdit() {
    this.editingId = null;
    this.editedQuestion = '';
    this.editedAnswer = '';
  }

  saveEdit(card: Flashcard) {
    if (this.editingId === null) return;

    const updatedCard: Flashcard = {
      ...card,
      question: this.editedQuestion,
      answer: this.editedAnswer
    };

    this.flashcardService.updateFlashcard(updatedCard).subscribe(() => {
      card.question = this.editedQuestion;
      card.answer = this.editedAnswer;
      this.cancelEdit();
    });
  }

  toggleAnswer(card: Flashcard) {
    card.showAnswer = !card.showAnswer;
  }
}
