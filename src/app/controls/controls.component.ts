import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css'],
})
export class ControlsComponent {
  @Output() actionTaken = new EventEmitter<string>();
  @Output() resetSimulation = new EventEmitter<void>();

  measures = [
    { name: 'Nenhuma medida', value: 'none', description: 'Sem intervenções' },
    {
      name: 'Uso de Máscaras',
      value: 'masks',
      description: 'Reduz transmissão em 30%',
    },
    {
      name: 'Distanciamento Social',
      value: 'distancing',
      description: 'Reduz transmissão em 50%',
    },
    {
      name: 'Lockdown',
      value: 'lockdown',
      description: 'Reduz transmissão em 80%',
    },
    {
      name: 'Vacinação',
      value: 'vaccination',
      description: 'Aumenta recuperação em 40%',
    },
  ];

  selectedMeasure: string = 'none';

  takeAction() {
    this.actionTaken.emit(this.selectedMeasure);
  }

  reset() {
    this.resetSimulation.emit();
  }
}
