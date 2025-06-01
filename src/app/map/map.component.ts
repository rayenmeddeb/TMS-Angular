import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map!: L.Map;
  private vehicleMarkers: { [id: string]: L.Marker } = {};
  private apiUrl = 'http://localhost:8027/api/vehicle-positions';
  private reverseGeocodeUrl = 'https://api.openrouteservice.org/geocode/reverse';
  private apiKey = '5b3ce3597851110001cf624869e9a9e917c845c49753047d0a554809'; // Clé publique test ORS

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.initMap();
    this.loadPositions();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [36.8, 10.2],
      zoom: 7
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadPositions(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      data.forEach(pos => {
        if (pos.latitude && pos.longitude && pos.matricule) {
          this.getAddress(pos.longitude, pos.latitude).then(address => {
            const popupContent = `
              <b>Matricule:</b> ${pos.matricule}<br>
              <b>Date:</b> ${pos.date || 'N/A'}<br>
              <b>Adresse:</b> ${address}
            `;

            const marker = L.marker([pos.latitude, pos.longitude])
              .addTo(this.map)
              .bindPopup(popupContent);

            this.vehicleMarkers[pos.matricule] = marker;
          });
        }
      });
    });
  }

  private async getAddress(lon: number, lat: number): Promise<string> {
    const url = `${this.reverseGeocodeUrl}?api_key=${this.apiKey}&point.lon=${lon}&point.lat=${lat}`;
    try {
      const response: any = await this.http.get(url).toPromise();
      return response?.features?.[0]?.properties?.label || 'Adresse non trouvée';
    } catch (error) {
      console.error('Erreur lors du géocodage inverse:', error);
      return 'Adresse non disponible';
    }
  }

  zoomToVehicle(matricule: string): void {
    const marker = this.vehicleMarkers[matricule];
    if (marker) {
      this.map.setView(marker.getLatLng(), 18);
      marker.openPopup();
    } else {
      alert(`Aucun véhicule trouvé avec l'ID: ${matricule}`);
    }
  }
}
