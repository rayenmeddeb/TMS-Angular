import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  cards = [
    { 
      name: 'Tournés', 
      icon: 'fas fa-route fa-3x', 
      color: '#FF6B6B', 
      route: '/layout/tourne' 
    },
    { 
      name: 'Ordres de transport', 
      icon: 'fas fa-truck-loading fa-3x', 
      color: '#4ECDC4', 
      route: '/layout/OT' 
    },
    { 
      name: 'Articles', 
      icon: 'fas fa-box-open fa-3x', 
      color: '#45B7D1', 
      route: '/layout/article' 
    },
    { 
      name: 'Utilisateurs', 
      icon: 'fas fa-users fa-3x', 
      color: '#FFA07A', 
      route: '/layout/utilisateur' 
    },
    { 
      name: 'Clients', 
      icon: 'fas fa-user-tie fa-3x', 
      color: '#98D8C8', 
      route: '/layout/client' 
    },
    { 
      name: 'Chauffeurs', 
      icon: 'fas fa-user-astronaut fa-3x', 
      color: '#F06292', 
      route: '/layout/chauffeur' 
    },
    { 
      name: 'Camions', 
      icon: 'fas fa-truck fa-3x', 
      color: '#7986CB', 
      route: '/layout/camion' 
    },
    { 
      name: 'Map', 
      icon: 'fas fa-map fa-3x', 
      color: '#68ff33', 
      route: '/layout/map' 
    },
    { 
      name: 'Sites', 
      icon: 'fas fa-location fa-3x', 
      color: '#5d65ec', 
      route: '/layout/site' 
    },
    { 
      name: 'Planning', 
      icon: 'fas fa-table-list fa-3x', 
      color: '#f3eb49', 
      route: '/layout/planning' 
    }

  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}