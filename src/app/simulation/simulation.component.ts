import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css'],
})
export class SimulationComponent implements OnInit {
  private chart!: Chart;

  // Dados da simulação
  simulationData = {
    days: 100,
    infected: [] as number[],
    dead: [] as number[],
    recovered: [] as number[],
    susceptible: [] as number[],
    population: [] as number[],
  };

  // Parâmetros da simulação
  initialPopulation = 1000000;
  initialInfected = 10;
  infectionRate = 0.3;
  recoveryRate = 0.1;
  mortalityRate = 0.02;

  // Fatores atuais
  currentInfectionFactor = 1.0;
  currentRecoveryFactor = 1.0;

  // Efeitos das medidas
  measures = {
    masks: { infection: 0.7, recovery: 1.0 },
    distancing: { infection: 0.5, recovery: 1.0 },
    lockdown: { infection: 0.2, recovery: 1.0 },
    vaccination: { infection: 1.0, recovery: 1.4 },
  };

  constructor(private route: ActivatedRoute, private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.resetSimulation();
    this.createChart();
  }

  createChart() {
    const canvas = document.getElementById(
      'simulationChart'
    ) as HTMLCanvasElement;

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: Array.from(
          { length: this.simulationData.days },
          (_, i) => `Dia ${i + 1}`
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
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  resetSimulation() {
    // Inicializa arrays com zeros
    this.simulationData = {
      days: 100,
      infected: Array(100).fill(0),
      dead: Array(100).fill(0),
      recovered: Array(100).fill(0),
      susceptible: Array(100).fill(
        this.initialPopulation - this.initialInfected
      ),
      population: Array(100).fill(this.initialPopulation),
    };

    // Configura casos iniciais
    this.simulationData.infected[0] = this.initialInfected;
    this.currentInfectionFactor = 1.0;
    this.currentRecoveryFactor = 1.0;

    this.runSimulation();
  }

  applyMeasure(measure: keyof typeof this.measures) {
    // Aplica os fatores da medida selecionada
    this.currentInfectionFactor *= this.measures[measure].infection;
    this.currentRecoveryFactor *= this.measures[measure].recovery;

    // Roda a simulação com os novos fatores
    this.runSimulation();
  }

  runSimulation() {
    for (let day = 1; day < this.simulationData.days; day++) {
      const prevInfected = this.simulationData.infected[day - 1];
      const prevSusceptible = this.simulationData.susceptible[day - 1];

      // Calcula novos casos
      const newInfected = Math.min(
        prevSusceptible,
        Math.floor(
          prevInfected *
            this.infectionRate *
            this.currentInfectionFactor *
            (prevSusceptible / this.initialPopulation)
        )
      );

      const newRecovered = Math.floor(
        prevInfected * this.recoveryRate * this.currentRecoveryFactor
      );
      const newDead = Math.floor(prevInfected * this.mortalityRate);

      // Atualiza os dados
      this.simulationData.infected[day] =
        prevInfected + newInfected - newRecovered - newDead;
      this.simulationData.recovered[day] =
        this.simulationData.recovered[day - 1] + newRecovered;
      this.simulationData.dead[day] =
        this.simulationData.dead[day - 1] + newDead;
      this.simulationData.susceptible[day] = prevSusceptible - newInfected;
    }

    // Atualiza o gráfico
    this.updateChart();
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = this.simulationData.infected;
      this.chart.data.datasets[1].data = this.simulationData.dead;
      this.chart.data.datasets[2].data = this.simulationData.recovered;
      this.chart.update();
    }
  }
  goBack() {
    this.router.navigate(['/home']);
  }
}
