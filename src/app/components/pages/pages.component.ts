import { Component, Input, NgZone, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { env } from '../../environments/dev.env';
import { AlertService } from '../../services/alert.service';
import { ScoresService } from '../../services/scores.service';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
})
export class PagesComponent implements OnInit {
  pagesList: Array<any> = [
    { title: '', url: '', currentPage: true, pageScore: null },
  ];
  scannedPages: number = 0;
  domain = env.testedDomain;
  fullUrl = '';
  currentUrlPage = '';
  @Input() pagesScores: any;
  disableSubmitButton = true;

  constructor(
    private adminservice: AdminService,
    private ngZone: NgZone,
    private alertService: AlertService,
    private scores: ScoresService
  ) {}

  ngOnInit(): void {
    window.addEventListener('message', (event) => {
      if (event.data.message === 'domain') {
        console.log('message type from iframe:', event.data.message);

        this.ngZone.run(() => {
          console.log('Received message from iframe:', event.data);

          this.fullUrl = event.data.domain;
          this.currentUrlPage = event.data.currentPage;
          const apiKey = event.data.apiKey;
          const adminEmail = event.data.adminEmail;
          this.adminservice
            .getPages(this.fullUrl, apiKey, adminEmail)
            .subscribe({
              next: (data) => {
                // Map backend pages with scores and current page info
                this.pagesList = data.pages.map((page) => {
                  if (this.currentUrlPage?.includes(page.url)) {
                    localStorage.setItem('currentPageTitle', '');
                    localStorage.setItem('currentPageTitle', page.title);
                    this.scores.setCurrentPage(page.title);
                    this.scores.titleSubject.next(page.title);
                  }
                  return {
                    title: page.title,
                    url: page.url,
                    currentPage: this.currentUrlPage?.includes(page.url),
                    pageScore: localStorage.getItem(page.url)
                      ? JSON.parse(localStorage.getItem(page.url) || '{}')
                          .pageScore
                      : null,
                  };
                });
                this.scannedPages = this.pagesList.filter(
                  (page) => page.pageScore !== null
                ).length;
              },
              error: (error) => {
                console.error('Error loading pages:', error);
              },
            });
        });
      }
      if (event.data.message === 'results') {
        console.log('message type from iframe:', event.data.message);
        this.ngZone.run(() => {
          this.pagesList = this.pagesList.map((page) => {
            if (this.currentUrlPage?.includes(page.url)) {
              localStorage.setItem('currentPageTitle', page.title);
              this.scores.setCurrentPage(page.title);
              this.scores.titleSubject.next(page.title);
            }
            return {
              title: page.title,
              url: page.url,
              currentPage: this.currentUrlPage?.includes(page.url),
              pageScore: localStorage.getItem(page.url)
                ? JSON.parse(localStorage.getItem(page.url) || '{}').pageScore
                : null,
            };
          });
          console.log('this.pagesList', this.pagesList);

          this.scannedPages = this.pagesList.filter(
            (page) => page.pageScore !== null
          ).length;
          console.log(this.scannedPages);
          if (
            this.pagesList.filter((page) => page.pageScore === null).length > 0
          ) {
            this.disableSubmitButton = true;
            console.log(this.disableSubmitButton);
          } else {
            this.disableSubmitButton = false;
            console.log(this.disableSubmitButton);
          }
        });
      }
    });
  }

  submitScores() {
    const scores: Array<any> = this.pagesList.map((page) => ({
      title: page.title,
      url: page.url,
      accessibilityScore: page.pageScore,
    }));
    console.log('this.pagesList:', this.pagesList);
    console.log(typeof scores);

    this.adminservice.submitScores({ pages: scores }).subscribe({
      next: (response) => {
        console.log('Scores submitted successfully:', response);
        this.alertService.showAlert('success', response.message);
      },
      error: (error) => {
        console.error('Error submitting scores:', error);
        //  this.alertService.showAlert('danger', error);
      },
    });
  }

  roundPercentage(value: number): number {
    return Math.round(value);
  }
}
