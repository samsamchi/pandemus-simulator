import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interface para tipar os dados da simulação (opcional, mas recomendado)
export interface Simulation {
  id?: number; // ID é opcional (gerado pelo backend)
  name?: string;
  days?: number;
  infected: number[];
  dead: number[];
  recovered: number[];
}

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private apiUrl = 'http://localhost:3000/api'; // URL base da API

  constructor(private http: HttpClient) {}

  // Verifica se o backend está rodando (GET /api)
  checkBackend(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}`);
  }

  // Cria uma simulação (POST /api/simulation/create)
  createSimulation(simulation: Simulation): Observable<Simulation> {
    return this.http.post<Simulation>(
      `${this.apiUrl}/simulation/create`,
      simulation
    );
  }

  // Lista todas as simulações (GET /api/simulation/list)
  getAllSimulations(): Observable<Simulation[]> {
    return this.http.get<Simulation[]>(`${this.apiUrl}/simulation/list`);
  }

  // Busca uma simulação por ID (GET /api/simulation/:id)
  getSimulationById(id: number): Observable<Simulation> {
    return this.http.get<Simulation>(`${this.apiUrl}/simulation/${id}`);
  }

  // Deleta uma simulação por ID (DELETE /api/simulation/:id/delete)
  deleteSimulation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/simulation/${id}/delete`);
  }
}
