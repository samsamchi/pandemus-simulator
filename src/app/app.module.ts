import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlsComponent } from './controls/controls.component';
import { SimulationComponent } from './simulation/simulation.component';
import { StatsComponent } from './stats/stats.component';

import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { VirusInfoComponent } from './virus-info/virus-info.component';

@NgModule({
  declarations: [
    AppComponent,
    SimulationComponent,
    ControlsComponent,
    StatsComponent,
    HomeComponent,
    VirusInfoComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
