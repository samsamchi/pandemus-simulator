import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  userName: string = '';

  constructor(private router: Router) {}

  startSimulation() {
    localStorage.setItem('healthAuthority', this.userName);
    this.router.navigate(['/simulation']);
  }

  showVirus(virusType: string) {
    this.router.navigate(['/virus-info', virusType]);
  }
}
