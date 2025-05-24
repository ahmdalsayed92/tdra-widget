import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScoresService {
  constructor() {
    const stored = localStorage.getItem('scores');
    if (stored) {
      this.fullScores = JSON.parse(stored);
    }
  }

  private fullScores: Array<any> = [];
  private currentPage: string = '';
  private pages: Array<any> = [];
  titleSubject = new Subject<string>();
  // Add or update score
  setScores(newScore: any) {
    // Remove any existing score for the same page title
    this.fullScores = this.fullScores.filter(
      (score) => score.title !== newScore.title
    );

    // Push new score
    this.fullScores.push(newScore);

    // Save updated scores to localStorage
    localStorage.setItem('scores', JSON.stringify(this.fullScores));
    console.log('Updated fullScores:', this.fullScores);
  }

  getScores() {
    return this.fullScores;
  }

  setCurrentPage(page: string) {
    this.currentPage = page;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  setPages(pages: Array<any>) {
    this.pages = pages;
  }

  getPages() {
    return this.pages;
  }

  // Optional helper
  removeDuplicates(arr: any[], key: string): Array<any> {
    const seen = new Set();
    return arr.filter((item) => {
      const val = item[key];
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  }
}
