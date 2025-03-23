import { Component, NgZone, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { CommonModule } from '@angular/common';

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
  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    // Listen for messages from the parent window
    window.addEventListener('message', (event) => {
      // console.log('Message received in iframe:', event.data);

      // Optional: Validate origin for security
      if (event.data.message === 'results') {
        // Update the message inside Angular zone
        this.ngZone.run(() => {
          this.receivedMessage = event.data.message;
          this.results = event.data.results;
          console.log('this.results', this.results);

          // Calculate accessibility score
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
        });
      }
    });
  }
  startScan() {
    console.log('click inside the widget');
    window.parent.postMessage({ message: 'start the scan!' }, '*');
  }

  roundPercentage(value: number): number {
    return Math.round(value);
  }
}
