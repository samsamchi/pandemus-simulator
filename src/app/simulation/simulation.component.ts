import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

interface Virus {
  name: string;
  infectionRate: number;
  recoveryRate: number;
  mortalityRate: number;
  measuresEffect: {
    máscara: { infection: number; recovery: number };
    distanciamento: { infection: number; recovery: number };
    lockdown: { infection: number; recovery: number };
    vacinação: { infection: number; recovery: number };
  };
  maxYAxis: number; // Valor máximo do eixo Y para o gráfico
}

const VIRUS_TYPES: { [key: string]: Virus } = {
  COVID19: {
    name: 'COVID-19',
    infectionRate: 0.3,
    recoveryRate: 0.1,
    mortalityRate: 0.02,
    maxYAxis: 500000,
    measuresEffect: {
      máscara: { infection: 0.7, recovery: 1.0 },
      distanciamento: { infection: 0.6, recovery: 1.0 },
      lockdown: { infection: 0.3, recovery: 1.0 },
      vacinação: { infection: 0.5, recovery: 1.5 },
    },
  },
  INFLUENZA: {
    name: 'Influenza',
    infectionRate: 0.2,
    recoveryRate: 0.15,
    mortalityRate: 0.001,
    maxYAxis: 300000,
    measuresEffect: {
      máscara: { infection: 0.5, recovery: 1.0 },
      distanciamento: { infection: 0.8, recovery: 1.0 },
      lockdown: { infection: 0.7, recovery: 1.0 },
      vacinação: { infection: 0.3, recovery: 1.8 },
    },
  },
  EBOLA: {
    name: 'Ebola',
    infectionRate: 0.4,
    recoveryRate: 0.05,
    mortalityRate: 0.5,
    maxYAxis: 1000000,
    measuresEffect: {
      máscara: { infection: 0.9, recovery: 1.0 },
      distanciamento: { infection: 0.7, recovery: 1.0 },
      lockdown: { infection: 0.6, recovery: 1.0 },
      vacinação: { infection: 0.2, recovery: 2.0 },
    },
  },
};

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css'],
})
export class SimulationComponent implements OnInit {
  private chart!: Chart;

  VIRUS_TYPES = VIRUS_TYPES;
  selectedVirus: Virus = VIRUS_TYPES['COVID19'];
  virusKeys = Object.keys(VIRUS_TYPES);
  currentMeasure: string = 'Nenhuma';

  simulationData = {
    days: 100,
    infected: [] as number[],
    dead: [] as number[],
    recovered: [] as number[],
    susceptible: [] as number[],
    population: [] as number[],
  };

  initialPopulation = 1000000;
  initialInfected = 10;
  infectionRate = 0.3;
  recoveryRate = 0.1;
  mortalityRate = 0.02;

  currentInfectionFactor = 1.0;
  currentRecoveryFactor = 1.0;

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
            max: this.selectedVirus.maxYAxis,
          },
        },
      },
    });
  }

  selectVirus(virusKey: string) {
    this.selectedVirus = VIRUS_TYPES[virusKey];
    this.resetSimulation();
  }

  resetSimulation() {
    this.infectionRate = this.selectedVirus.infectionRate;
    this.recoveryRate = this.selectedVirus.recoveryRate;
    this.mortalityRate = this.selectedVirus.mortalityRate;
    this.currentInfectionFactor = 1.0;
    this.currentRecoveryFactor = 1.0;
    this.currentMeasure = 'Nenhuma';

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
    this.simulationData.infected[0] = this.initialInfected;
    this.runSimulation();
  }

  applyMeasure(measure: keyof typeof this.selectedVirus.measuresEffect) {
    const effect = this.selectedVirus.measuresEffect[measure];
    this.currentInfectionFactor = effect.infection;
    this.currentRecoveryFactor = effect.recovery;
    this.currentMeasure = measure.charAt(0).toUpperCase() + measure.slice(1);
    this.runSimulation();
  }

  runSimulation() {
    for (let day = 1; day < this.simulationData.days; day++) {
      const prevInfected = this.simulationData.infected[day - 1];
      const prevSusceptible = this.simulationData.susceptible[day - 1];

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

      this.simulationData.infected[day] =
        prevInfected + newInfected - newRecovered - newDead;
      this.simulationData.recovered[day] =
        this.simulationData.recovered[day - 1] + newRecovered;
      this.simulationData.dead[day] =
        this.simulationData.dead[day - 1] + newDead;
      this.simulationData.susceptible[day] = prevSusceptible - newInfected;
    }

    this.updateChart();
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = this.simulationData.infected;
      this.chart.data.datasets[1].data = this.simulationData.dead;
      this.chart.data.datasets[2].data = this.simulationData.recovered;
      this.chart.options.scales!['y']!.max = this.selectedVirus.maxYAxis;
      this.chart.update();
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
