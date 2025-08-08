export interface Flashcard {
  question: string;
  answer: string;
  lastReviewed?: string;
  correctCount?: number;
  id: number;
  showAnswer?: boolean; 
  category?: string;
}
