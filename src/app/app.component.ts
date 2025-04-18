import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { PagesComponent } from './components/pages/pages.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { HeaderComponent } from './components/header/header.component';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PagesComponent, ScannerComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('alertContainer', { read: ViewContainerRef, static: true })
  alertContainer!: ViewContainerRef;
  pagesScores: any;

  constructor(private alertService: AlertService) {}
  setScores(scores: Object) {
    this.pagesScores = scores;
    console.log('scores:', this.pagesScores);
  }

  ngAfterViewInit(): void {
    this.alertService.registerContainer(this.alertContainer);
  }
}
