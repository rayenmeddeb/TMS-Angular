import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VoyageService } from '../services/voyage.service';
import { Voyage } from '../models/voyage';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-voyage',
  templateUrl: './voyage.component.html',
  styleUrls: ['./voyage.component.css']
})
export class VoyageComponent implements OnInit {
  displayedColumns: string[] = [
    'numeroVoyage',
    'kilometrageTotal',
    'codeChauffeur',
    'codeCamion',
    'dateCreation',
    'ordresCount',
    'actions'
  ];
  voyages: Voyage[] = [];

  @ViewChild('detailsDialogTemplate') detailsDialogTemplate!: TemplateRef<any>;
  @ViewChild('mapDialogTemplate') mapDialogTemplate!: TemplateRef<any>;

  constructor(
    private voyageService: VoyageService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadVoyages();
    this.fixLeafletIcons();
  }

  private fixLeafletIcons(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: null,
      shadowSize: [0, 0]
    });
  }

  loadVoyages(): void {
    this.voyageService.getAllVoyages().subscribe({
      next: (voyages) => {
        this.voyages = voyages;
      },
      error: (err) => {
        this.showError('Erreur lors du chargement des voyages');
      }
    });
  }

  openDetailsDialog(voyage: Voyage): void {
    this.dialog.open(this.detailsDialogTemplate, {
      width: '600px',
      data: voyage
    });
  }

  openMapDialog(voyage: Voyage): void {
    const dialogRef = this.dialog.open(this.mapDialogTemplate, {
      width: '800px',
      height: '600px',
      data: voyage
    });

    dialogRef.afterOpened().subscribe(() => {
      this.initializeMap(voyage);
    });
  }

  private initializeMap(voyage: Voyage): void {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      this.showError('Conteneur de carte non trouvé');
      return;
    }

    const map = L.map(mapContainer).setView([36.8, 10.2], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      detectRetina: true
    }).addTo(map);

    if (voyage.ordres?.length > 0) {
      this.addRoute(map, voyage);
    }
  }

  private addRoute(map: L.Map, voyage: Voyage): void {
    try {
      // Vérification des données
      if (!voyage.ordres || voyage.ordres.length === 0) {
        throw new Error('Aucun ordre de voyage disponible');
      }

      // Création des waypoints
      const waypoints = [
        L.latLng(voyage.ordres[0].latitudeDepart, voyage.ordres[0].longitudeDepart),
        ...voyage.ordres.map(ordre => {
          if (!ordre.latitudeArrivee || !ordre.longitudeArrivee) {
            throw new Error('Coordonnées manquantes pour un ordre de voyage');
          }
          return L.latLng(ordre.latitudeArrivee, ordre.longitudeArrivee);
        })
      ];

      // Préparation des libellés
      const cityLabels = [
        `Départ: ${voyage.ordres[0].villeDepartNom || 'Inconnu'}`,
        ...voyage.ordres.map((ordre, index) => {
          const ville = ordre.villeArriveeNom || 'Inconnu';
          return index === voyage.ordres.length - 1 
            ? `Arrivée: ${ville}` 
            : `Étape ${index + 1}: ${ville}`;
        })
      ];

      // Configuration du routage
      const routingControl = L.Routing.control({
        waypoints: waypoints,
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        plan: L.Routing.plan(waypoints, {
          createMarker: (i, waypoint) => {
            return L.marker(waypoint.latLng, {
              icon: L.icon({
                iconUrl: 'assets/marker.png',
                iconSize: [25, 41],
                shadowUrl: null
              })
            }).bindPopup(cityLabels[i]);
          },
          draggableWaypoints: false,
          addWaypoints: false
        }),
        lineOptions: {
          styles: [{ color: '#3388ff', weight: 6, opacity: 0.9 }],
          extendToWaypoints: true,
          missingRouteTolerance: 1
        },
        fitSelectedRoutes: true,
        showAlternatives: false,
        routeWhileDragging: false
      }).addTo(map);

      // Ajustement de la vue après le chargement de l'itinéraire
      routingControl.on('routesfound', (e) => {
        const routes = e.routes;
        if (routes && routes.length > 0) {
          map.fitBounds(routes[0].coordinates);
        }
      });

    } catch (error) {
      console.error('Erreur lors du traçage de la route:', error);
      this.showWarning(error instanceof Error ? error.message : 'Erreur inconnue lors du traçage');
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', { 
      duration: 3000, 
      panelClass: ['error-snackbar'] 
    });
  }

  private showWarning(message: string): void {
    this.snackBar.open(message, 'Fermer', { 
      duration: 3000, 
      panelClass: ['warning-snackbar'] 
    });
  }
}