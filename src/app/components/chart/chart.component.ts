import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnChanges {
  @Input() percentage: number = 0;
  backgroundStyle: string = '';
  poor = '#D83731';
  average = '#E54B1D';
  good = '#d6d009';
  excellent = '#3F8E50';

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChart();
  }

  private updateChart(): void {
    this.backgroundStyle = `conic-gradient(#ddd ${
      100 - this.percentage
    }%, #3F8E50 0%)`;
  }
}
