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
  allFlashcards: Flashcard[] = []; // keep full list for filtering
  newQuestion = '';
  newAnswer = '';
  newCategory = '';
  editingId: number | null = null;
  editedQuestion: string = '';
  editedAnswer: string = '';
  editedCategory: string = '';
  selectedCategory = '';
  categories: string[] = [];
  showAnswer?: boolean;
  

  constructor(private flashcardService: FlashcardService) { }

  ngOnInit() {
    this.loadFlashcards();
  }

  loadFlashcards() {
    this.flashcardService.getFlashcards().subscribe(cards => {
      this.allFlashcards = cards.map(card => ({
        ...card,
        flipped: false,
        showAnswer: false
      }));
      this.extractCategories();
      this.filterFlashcards();
    });
  }


  extractCategories() {
    const uniqueCategories = new Set(this.allFlashcards.map(c => c.category || 'General'));
    this.categories = Array.from(uniqueCategories);
  }

  filterFlashcards() {
    if (!this.selectedCategory) {
      this.flashcards = [...this.allFlashcards];
    } else {
      this.flashcards = this.allFlashcards.filter(card => (card.category || 'General') === this.selectedCategory);
    }
  }

  addFlashcard() {
    if (!this.newQuestion.trim() || !this.newAnswer.trim()) return;

    const newFlashcard: Flashcard = {
      id: 0,
      question: this.newQuestion,
      answer: this.newAnswer,
      category: this.newCategory.trim() || 'General'
    };

    this.flashcardService.createFlashcard(newFlashcard).subscribe(card => {
      this.allFlashcards.push(card);
      this.extractCategories();
      this.filterFlashcards();
      this.newQuestion = '';
      this.newAnswer = '';
      this.newCategory = '';
    });
  }

  deleteFlashcard(id: number) {
    this.flashcardService.deleteFlashcard(id).subscribe(() => {
      this.allFlashcards = this.allFlashcards.filter(card => card.id !== id);
      this.extractCategories();
      this.filterFlashcards();
    });
  }

  startEditing(card: Flashcard) {
    this.editingId = card.id;
    this.editedQuestion = card.question;
    this.editedAnswer = card.answer;
    this.editedCategory = card.category || 'General';
  }

  cancelEdit() {
    this.editingId = null;
    this.editedQuestion = '';
    this.editedAnswer = '';
    this.editedCategory = '';
  }

  saveEdit(card: Flashcard) {
    if (this.editingId === null) return;

    const updatedCard: Flashcard = {
      ...card,
      question: this.editedQuestion,
      answer: this.editedAnswer,
      category: this.editedCategory.trim() || 'General'
    };

    this.flashcardService.updateFlashcard(updatedCard).subscribe(savedCard => {
      // update local copies
      const idxAll = this.allFlashcards.findIndex(c => c.id === card.id);
      if (idxAll > -1) this.allFlashcards[idxAll] = savedCard;

      this.extractCategories();
      this.filterFlashcards();
      this.cancelEdit();
    });
  }

  toggleAnswer(card: Flashcard) {
    card.showAnswer = !card.showAnswer;
  }

  shuffleFlashcards() {
    for (let i = this.flashcards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.flashcards[i], this.flashcards[j]] = [this.flashcards[j], this.flashcards[i]];
    }
  }

  toggleFlip(card: Flashcard) {
    card.flipped = !card.flipped;
  }

}
