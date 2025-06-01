import * as L from 'leaflet';
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tunisia-map',
  templateUrl: './tunisia-map.component.html',
  styleUrls: ['./tunisia-map.component.css']
})
export class TunisiaMapComponent  implements AfterViewInit {
  private map: L.Map;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Coordonnées centrées sur la Tunisie (environ Tunis)
    const tunisiaCenter: L.LatLngExpression = [34, 9];
    // Coordonnées de Nabeul, Tunisie
    const nabeulCoords: L.LatLngExpression = [36.4561, 10.7376];
    
    // Création de la carte avec une vue verticale
    this.map = L.map('map', {
      center: tunisiaCenter,
      zoom: 6.5,
      minZoom: 6,
      maxZoom: 13,
      zoomControl: false, // Nous ajouterons un contrôle personnalisé
      attributionControl: false,
      worldCopyJump: true,
      maxBounds: L.latLngBounds(
        L.latLng(30, 7),  // Sud-Ouest
        L.latLng(38, 12)   // Nord-Est
      )
    });

    // Ajout des tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Contrôle de zoom personnalisé positionné à droite
    L.control.zoom({
      position: 'topright'
    }).addTo(this.map);

    // Redimensionnement après un léger délai
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
    const customIcon = L.icon({
      iconUrl: '/assets/marker.png', // Chemin vers votre icône
      iconSize: [25, 41], // Taille de l'icône
      iconAnchor: [12, 41], // Point d'ancrage
      popupAnchor: [1, -34] // Point d'ancrage du popup
    });


  const marker = L.marker(nabeulCoords, {
    icon: customIcon,
    title: "Nabeul, Tunisie"
  }).addTo(this.map);

  // Ajout d'un popup d'information
  marker.bindPopup(`
    <b>Nabeul</b><br>
    Gouvernorat de Nabeul, Tunisie<br>
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Nabeul_plage.jpg/320px-Nabeul_plage.jpg" 
         alt="Nabeul" 
         style="width:100%; margin-top:5px;">
    <p>Capitale du cap Bon, connue pour sa poterie et ses plages</p>
  `);

  // Optionnel: Ajouter un cercle autour du marqueur
  L.circle(nabeulCoords, {
    color: 'blue',
    fillColor: '#30f',
    fillOpacity: 0.2,
    radius: 2000 // 2km de rayon
  }).addTo(this.map);
}
}