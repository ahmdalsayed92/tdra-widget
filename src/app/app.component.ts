import { Component } from '@angular/core';
import { PagesComponent } from './components/pages/pages.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PagesComponent, ScannerComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
