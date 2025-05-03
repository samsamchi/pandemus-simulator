import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Pandemus Simulator';

  simulationData = {
    days: 100,
    infected: [] as number[],
    dead: [] as number[],
    recovered: [] as number[],
    susceptible: [] as number[],
    population: [] as number[],
    currentMeasures: [] as string[],
  };

  currentStats = {
    day: 0,
    infected: 0,
    dead: 0,
    recovered: 0,
    susceptible: 0,
    population: 0,
  };

  // Parâmetros da simulação
  initialPopulation = 1000000;
  initialInfected = 10;
  infectionRate = 0.3;
  recoveryRate = 0.1;
  mortalityRate = 0.02;

  // Efeitos das medidas
  measureEffects: any = {
    none: { infectionFactor: 1.0, recoveryFactor: 1.0 },
    masks: { infectionFactor: 0.7, recoveryFactor: 1.0 },
    distancing: { infectionFactor: 0.5, recoveryFactor: 1.0 },
    lockdown: { infectionFactor: 0.2, recoveryFactor: 1.0 },
    vaccination: { infectionFactor: 1.0, recoveryFactor: 1.4 },
  };

  currentInfectionFactor = 1.0;
  currentRecoveryFactor = 1.0;

  ngOnInit(): void {
    this.resetSimulation();
  }

  resetSimulation() {
    this.simulationData = {
      days: 100,
      infected: Array(100).fill(0),
      dead: Array(100).fill(0),
      recovered: Array(100).fill(0),
      susceptible: Array(100).fill(
        this.initialPopulation - this.initialInfected
      ),
      population: Array(100).fill(this.initialPopulation),
      currentMeasures: Array(100).fill('none'),
    };

    this.simulationData.infected[0] = this.initialInfected;
    this.simulationData.susceptible[0] =
      this.initialPopulation - this.initialInfected;

    this.currentInfectionFactor = 1.0;
    this.currentRecoveryFactor = 1.0;

    this.updateStats(0);
    this.runSimulation();
  }

  applyMeasure(measure: string) {
    const effects = this.measureEffects[measure];
    this.currentInfectionFactor = effects.infectionFactor;
    this.currentRecoveryFactor = effects.recoveryFactor;

    // Atualiza a simulação com a nova medida
    this.runSimulation();
  }

  runSimulation() {
    for (let day = 1; day < this.simulationData.days; day++) {
      const prevInfected = this.simulationData.infected[day - 1];
      const prevRecovered = this.simulationData.recovered[day - 1];
      const prevDead = this.simulationData.dead[day - 1];
      const prevSusceptible = this.simulationData.susceptible[day - 1];

      // Novos infectados
      const newInfected = Math.min(
        prevSusceptible,
        Math.floor(
          prevInfected *
            this.infectionRate *
            this.currentInfectionFactor *
            (prevSusceptible / this.initialPopulation)
        )
      );

      // Novos recuperados
      const newRecovered = Math.floor(
        prevInfected * this.recoveryRate * this.currentRecoveryFactor
      );

      // Novas mortes
      const newDead = Math.floor(prevInfected * this.mortalityRate);

      // Atualiza os valores
      this.simulationData.infected[day] =
        prevInfected + newInfected - newRecovered - newDead;
      this.simulationData.recovered[day] = prevRecovered + newRecovered;
      this.simulationData.dead[day] = prevDead + newDead;
      this.simulationData.susceptible[day] = prevSusceptible - newInfected;
      this.simulationData.population[day] =
        this.initialPopulation - this.simulationData.dead[day];
      this.simulationData.currentMeasures[day] =
        this.simulationData.currentMeasures[day - 1];
    }

    this.updateStats(this.simulationData.days - 1);
  }

  updateStats(day: number) {
    this.currentStats = {
      day: day + 1,
      infected: this.simulationData.infected[day],
      dead: this.simulationData.dead[day],
      recovered: this.simulationData.recovered[day],
      susceptible: this.simulationData.susceptible[day],
      population: this.simulationData.population[day],
    };
  }
}
