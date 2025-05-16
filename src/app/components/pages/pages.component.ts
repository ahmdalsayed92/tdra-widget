import { Component, Input, NgZone, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { env } from '../../environments/dev.env';
import { AlertService } from '../../services/alert.service';

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
  @Input() pagesScores: any;
  disableSubmitButton = true;

  constructor(
    private adminservice: AdminService,
    private ngZone: NgZone,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    window.addEventListener('message', (event) => {
      if (event.data.message) {
        this.ngZone.run(() => {
          console.log('Received message from iframe:', event.data);

          this.fullUrl = event.data.domain;
          const apiKey = event.data.apiKey;
          const adminEmail = event.data.adminEmail;
          this.adminservice
            .getPages(this.domain, apiKey, adminEmail)
            .subscribe({
              next: (data) => {
                // Map backend pages with scores and current page info
                this.pagesList = data.pages.map((page) => {
                  return {
                    title: page.title,
                    url: page.url,
                    currentPage: this.fullUrl?.includes(page.url),
                    pageScore: localStorage.getItem(page.url)
                      ? JSON.parse(localStorage.getItem(page.url) || '{}')
                          .pageScore
                      : null,
                  };
                });
                this.scannedPages = this.pagesList.filter(
                  (page) => page.pageScore !== null
                ).length;
                console.log(this.scannedPages);
                if (
                  this.pagesList.filter((page) => page.pageScore === null)
                    .length > 0
                ) {
                  this.disableSubmitButton = true;
                  console.log(this.disableSubmitButton);
                } else {
                  this.disableSubmitButton = false;
                  console.log(this.disableSubmitButton);
                }
              },
              error: (error) => {
                console.error('Error loading pages:', error);
              },
            });
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
}
