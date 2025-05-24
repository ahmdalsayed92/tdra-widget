import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { CommonModule } from '@angular/common';
import { ScoresService } from '../../services/scores.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [ChartComponent, CommonModule],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.scss',
})
export class ScannerComponent implements OnInit {
  receivedMessage: string = '';
  results: any;
  scorePercentage: any;
  totalRulesChecked: any;
  rulesWithIssues: any;
  pages: Array<any> = [];
  currentPageTitle: any = '';
  browserTitle: string = '';

  @Output() pagesScores = new EventEmitter<Object>();

  constructor(
    private ngZone: NgZone,
    private scores: ScoresService,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.currentPageTitle = localStorage.getItem('currentPageTitle') || '';
    this.scores.titleSubject.subscribe((a) => {
      this.currentPageTitle = a;
    });
    window.addEventListener('message', (event) => {
      // this.currentPageTitle = this.scores.getCurrentPage();
      // this.currentPageTitle = localStorage.getItem('currentPageTitle');
      if (event.data.message === 'results') {
        this.ngZone.run(() => {
          this.receivedMessage = event.data.message;
          this.results = event.data.results;
          const currentPage = event.data.currentPageUrl;

          // Compute accessibility score
          this.totalRulesChecked =
            this.results.passes.length +
            this.results.violations.length +
            this.results.inapplicable.length;

          this.rulesWithIssues = this.results.violations.length;

          this.scorePercentage =
            this.totalRulesChecked === 0
              ? 100
              : ((this.totalRulesChecked - this.rulesWithIssues) /
                  this.totalRulesChecked) *
                100;

          if (currentPage) {
            // Save the score for the current page
            const scoreData = {
              pageScore: this.scorePercentage,
              currentPage,
            };
            console.log('scoreData', scoreData);
            localStorage.setItem(currentPage, JSON.stringify(scoreData));
          }
        });
      }
    });
    // this.browserTitle = this.titleService.getTitle();
  }

  startScan() {
    window.parent.postMessage({ message: 'start the scan!' }, '*');
  }

  roundPercentage(value: number): number {
    return Math.round(value);
  }
}
