import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css'],
})
export class SimulationComponent implements OnInit {
  @Input() simulationData: any;
  chart: any;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.updateChart();
    }
  }

  createChart() {
    this.chart = new Chart('simulationChart', {
      type: 'line',
      data: {
        labels: Array.from(
          { length: this.simulationData.days },
          (_, i) => i + 1
        ),
        datasets: [
          {
            label: 'Infectados',
            data: this.simulationData.infected,
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Mortos',
            data: this.simulationData.dead,
            borderColor: 'black',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Recuperados',
            data: this.simulationData.recovered,
            borderColor: 'green',
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            tension: 0.4,
          },
          {
            label: 'Suscetíveis',
            data: this.simulationData.susceptible,
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            tension: 0.4,
          },
          {
            label: 'População Total',
            data: this.simulationData.population,
            borderColor: 'purple',
            backgroundColor: 'rgba(128, 0, 128, 0.1)',
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  updateChart() {
    this.chart.data.datasets[0].data = this.simulationData.infected;
    this.chart.data.datasets[1].data = this.simulationData.dead;
    this.chart.data.datasets[2].data = this.simulationData.recovered;
    this.chart.data.datasets[3].data = this.simulationData.susceptible;
    this.chart.data.datasets[4].data = this.simulationData.population;
    this.chart.update();
  }
}
