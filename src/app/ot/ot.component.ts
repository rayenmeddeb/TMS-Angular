import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { OrdreService } from '../services/ot.service';
import { ChauffeurService } from '../services/chauffeur.service';
import { VoyageService } from '../services/voyage.service';
import { Ordre } from '../models/ordre';
import { Chauffeur } from '../models/chauffeur.model';
import { Voyage } from '../models/voyage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ot',
  templateUrl: './ot.component.html',
  styleUrls: ['./ot.component.css']
})
export class OTComponent implements OnInit {
  constructor(
    private ordreService: OrdreService,
    private chauffeurService: ChauffeurService,
    private voyageService: VoyageService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ordres: Ordre[] = [];
  filteredOrdresList: Ordre[] = [];
  searchTerm: string = '';
  selectedOrder: Ordre | null = null;
  showColumnSettings = false;
  showFilterPopup = false;
  showPlanningPopup = false;
  chauffeurs: Chauffeur[] = [];
  selectedChauffeur: Chauffeur | null = null;

  filter = {
    contrat: '',
    codeSite: '',
    codearticle: '',
    numeroOrdre: ''
  };

  planningData = {
    codeChauffeur: '',
    codeCamion: ''
  };

  private orsApiKey = '5b3ce3597851110001cf624869e9a9e917c845c49753047d0a554809';

  availableColumns = [
    { key: 'contrat', label: 'Contrat', visible: true },
    { key: 'numeroOrdre', label: "Numéro d'Ordre", visible: true },
    { key: 'codeSite', label: 'Site', visible: true },
    { key: 'codearticle', label: 'Article', visible: true },
    { key: 'codeTiers', label: 'Tiers', visible: true },
    { key: 'codeDestinataire', label: 'Code Destinataire', visible: true },
    { key: 'codeExpediteur', label: 'Code Expediteur', visible: true },
    { key: 'dateCreation', label: 'Date Création', visible: true },
    { key: 'codePostalArrivee', label: 'Code Postal', visible: true },
    { key: 'villeArriveeNom', label: 'Ville Arrivée', visible: true },
    { key: 'etatOrdre', label: 'État Ordre', visible: true },
  ];

  get displayedColumns(): string[] {
    return [
      'select',
      ...this.availableColumns.filter(col => col.visible).map(col => col.key),
      'actions'
    ];
  }

  get filteredOrdres(): Ordre[] {
    let filtered = this.filteredOrdresList.length ? this.filteredOrdresList : this.ordres;
    if (!this.searchTerm) {
      return filtered;
    }
    const lowerTerm = this.searchTerm.toLowerCase();
    return filtered.filter(order =>
      (order.numeroOrdre?.toLowerCase().includes(lowerTerm) || '') ||
      (order.codeSite?.toLowerCase().includes(lowerTerm) || '')
    );
  }

  get selectedOrders(): Ordre[] {
    return this.ordres.filter(o => o.selected);
  }

  get totalPallets(): number {
    return this.selectedOrders.reduce((sum, order) => sum + (order.nbrepalette || 0), 0);
  }

  get totalWeight(): number {
    return this.selectedOrders.reduce((sum, order) => sum + (order.poid || 0), 0);
  }

  ngOnInit(): void {
    this.loadOrdre();
  }

  loadOrdre(): void {
    this.ordreService.getAllOrdres().subscribe({
      next: (res) => {
        this.ordres = res.map((ordre: Ordre) => ({ ...ordre, selected: false }));
        this.filteredOrdresList = [...this.ordres];
      },
      error: (err) => {
        this.snackBar.open('Erreur lors du chargement des ordres', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openOrderDetails(order: Ordre): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  isColumnVisible(key: string): boolean {
    return this.availableColumns.find(col => col.key === key)?.visible ?? true;
  }

  toggleSelectAll(event: MatCheckboxChange): void {
    const checked = event.checked;
    this.ordres.forEach(o => (o.selected = checked));
  }

  toggleRowSelection(ordre: Ordre): void {
    ordre.selected = !ordre.selected;
  }

  hasSelectedOrders(): boolean {
    return this.selectedOrders.length > 0;
  }

  openPlanningPopup(): void {
    if (this.hasSelectedOrders()) {
      this.fetchAvailableChauffeurs();
      this.showPlanningPopup = true;
    }
  }

  fetchAvailableChauffeurs(): void {
    if (!this.selectedOrders.length) {
      this.snackBar.open('Aucun ordre sélectionné', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const order = this.selectedOrders[0];
    if (!order.codeSite || !order.dateCreation) {
      this.snackBar.open('Données insuffisantes pour filtrer les chauffeurs', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const tempsConduite = order.tempsAssocie
      ? Math.round(order.tempsAssocie * 60)
      : order.tempsEstimeTrajet
        ? Math.round(parseFloat(order.tempsEstimeTrajet) * 60)
        : 120;

    if (tempsConduite <= 0) {
      this.snackBar.open('Temps de conduite invalide, utilisant 2 heures par défaut', 'Fermer', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
    }

    const dateDeVoyage = new Date(order.dateCreation).toISOString();

    this.chauffeurService.filtrerChauffeurs(order.codeSite, tempsConduite, dateDeVoyage).subscribe({
      next: (chauffeurs) => {
        this.chauffeurs = chauffeurs;
        if (chauffeurs.length === 0) {
          this.snackBar.open('Aucun chauffeur disponible', 'Fermer', {
            duration: 3000,
            panelClass: ['warning-snackbar']
          });
        }
      },
      error: (err) => {
        this.snackBar.open('Erreur lors du chargement des chauffeurs', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  selectChauffeur(chauffeur: Chauffeur): void {
    this.selectedChauffeur = chauffeur;
    this.planningData.codeChauffeur = chauffeur.codeUnique;
  }

  applyFilters(): void {
    this.filteredOrdresList = this.ordres.filter(ordre =>
      (!this.filter.contrat.trim() || (ordre.contrat?.toLowerCase().includes(this.filter.contrat.toLowerCase().trim()) || false)) &&
      (!this.filter.codeSite.trim() || (ordre.codeSite?.toLowerCase().includes(this.filter.codeSite.toLowerCase().trim()) || false)) &&
      (!this.filter.codearticle.trim() || (ordre.codearticle?.toLowerCase().includes(this.filter.codearticle.toLowerCase().trim()) || false)) &&
      (!this.filter.numeroOrdre.trim() || (ordre.numeroOrdre?.toLowerCase().includes(this.filter.numeroOrdre.toLowerCase().trim()) || false))
    );
    this.showFilterPopup = false;
  }

  resetFilters(): void {
    this.filter = {
      contrat: '',
      codeSite: '',
      codearticle: '',
      numeroOrdre: ''
    };
    this.filteredOrdresList = [...this.ordres];
  }

  optimizeRoute(): Observable<any> {
    const orders = this.selectedOrders;
    if (orders.length === 0) {
      this.snackBar.open('Aucun ordre sélectionné pour l\'optimisation', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      throw new Error('No orders selected');
    }

    const departure = {
      longitude: orders[0].longitudeDepart,
      latitude: orders[0].latitudeDepart
    };

    if (!orders.every(o => o.longitudeDepart === departure.longitude && o.latitudeDepart === departure.latitude)) {
      this.snackBar.open('Tous les ordres doivent avoir la même adresse de départ', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      throw new Error('Selected orders must have the same departure address');
    }

    const invalidCoords = orders.some(o =>
      !o.longitudeArrivee || !o.latitudeArrivee ||
      isNaN(o.longitudeArrivee) || isNaN(o.latitudeArrivee) ||
      o.longitudeArrivee < -180 || o.longitudeArrivee > 180 ||
      o.latitudeArrivee < -90 || o.latitudeArrivee > 90
    ) || !departure.longitude || !departure.latitude ||
       isNaN(departure.longitude) || isNaN(departure.latitude);

    if (invalidCoords) {
      this.snackBar.open('Coordonnées invalides pour un ou plusieurs ordres', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      throw new Error('Invalid coordinates');
    }

    const jobs = orders.map((order, index) => ({
      id: index + 1,
      service: 300, // Service time in seconds (5 minutes per stop)
      delivery: [1],
      location: [order.longitudeArrivee, order.latitudeArrivee],
      skills: [1],
      priority: orders.length - index
    }));

    const vehicles = [{
      id: 1,
      profile: 'driving-hgv',
      start: [departure.longitude, departure.latitude],
      capacity: [orders.length],
      skills: [1]
    }];

    const payload = {
      jobs,
      vehicles,
      options: { geometry: true }
    };

    console.log('ORS payload:', JSON.stringify(payload));

    return this.http.post('https://api.openrouteservice.org/optimization', payload, {
      headers: {
        'Authorization': `Bearer ${this.orsApiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  planifier(): void {
    if (!this.planningData.codeChauffeur || !this.planningData.codeCamion) {
      this.snackBar.open('Veuillez sélectionner un chauffeur et un camion', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const updatedOrders = this.selectedOrders.map(o => ({
      ...o,
      codeChauffeur: this.planningData.codeChauffeur,
      codeCamion: this.planningData.codeCamion
    }));

    this.optimizeRoute().subscribe({
      next: (response: any) => {
        console.log('ORS response:', response);
        console.log('ORS steps:', response.routes?.[0]?.steps || []);

        const routes = response.routes || [];
        if (!routes.length) {
          this.snackBar.open('Aucune route optimisée reçue de l\'API ORS', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          return;
        }

        if (response.unassigned?.length > 0) {
          const unassignedIds = response.unassigned.map((job: any) => job.id);
          this.snackBar.open(`Ordres non assignés (IDs: ${unassignedIds.join(', ')}). Vérifiez les coordonnées.`, 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          return;
        }

        let totalDistance = 0;
        let totalDuration = 0; // in seconds
        const orderedJobs: number[] = [];

        routes.forEach((route: any) => {
          console.log('Route distance:', route.distance, 'Route duration:', route.duration);
          totalDistance += route.distance || 0;
          totalDuration += route.duration || 0;
          (route.steps || []).forEach((step: any) => {
            if (step.type === 'job') {
              orderedJobs.push(step.job);
            }
          });
        });

        if (orderedJobs.length !== this.selectedOrders.length) {
          this.snackBar.open('Tous les ordres n\'ont pas été inclus dans la route', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          return;
        }

        let tempsTotal: number; // in hours
        if (totalDuration === 0) {
          console.warn('Duration missing in ORS response, calculating manually');
          tempsTotal = this.calculateManualDuration(updatedOrders, totalDistance / 1000);
          this.snackBar.open('Durée ORS manquante, calculée manuellement', 'Fermer', {
            duration: 3000,
            panelClass: ['warning-snackbar']
          });
        } else {
          tempsTotal = totalDuration / 3600; // Convert seconds to hours
        }

        if (totalDistance === 0) {
          console.warn('Distance missing in ORS response, calculating manually');
          totalDistance = this.calculateManualDistance(updatedOrders, orderedJobs);
          this.snackBar.open('Distance ORS manquante, calculée manuellement (~160–180 km attendu)', 'Fermer', {
            duration: 3000,
            panelClass: ['warning-snackbar']
          });
        }

        const orderedOrdres = orderedJobs.map(jobId => {
          const order = this.selectedOrders[jobId - 1];
          if (!order) {
            console.error(`Order not found for jobId: ${jobId}`);
            return null;
          }
          return order;
        }).filter((ordre): ordre is Ordre => ordre !== null);

        const voyage: Voyage = {
          numeroVoyage: `VOY-${Date.now()}`,
          ordres: orderedOrdres,
          kilometrageTotal: totalDistance / 1000, // Convert meters to kilometers
          tempsTotal: tempsTotal, // in hours
          codeChauffeur: this.planningData.codeChauffeur,
          codeCamion: this.planningData.codeCamion,
          dateCreation: new Date()
        };

        console.log('Voyage to save:', voyage);

        this.voyageService.saveVoyage(voyage).subscribe({
          next: (response) => {
            this.snackBar.open(
              `Planification réussie. Distance: ${voyage.kilometrageTotal.toFixed(2)} km, Durée: ${voyage.tempsTotal?.toFixed(2)} h`,
              'Fermer',
              {
                duration: 5000,
                panelClass: ['success-snackbar']
              }
            );
            this.showPlanningPopup = false;
            this.planningData = { codeChauffeur: '', codeCamion: '' };
            this.chauffeurs = [];
            this.selectedChauffeur = null;
            this.ordres.forEach(o => (o.selected = false));
            this.loadOrdre(); // Refresh the orders to reflect updated etatOrdre
          },
          error: (err) => {
            console.error('Error saving voyage:', err);
            this.snackBar.open('Erreur lors de la sauvegarde du voyage: ' + (err.error?.message || 'Erreur inconnue'), 'Fermer', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      },
      error: (err) => {
        console.error('Error optimizing route:', err);
        let message = 'Erreur lors de l\'optimisation du trajet';
        if (err.status === 403) {
          message = 'Accès interdit à l\'API ORS. Vérifiez votre clé API.';
        } else if (err.status === 429) {
          message = 'Quota dépassé pour l\'API ORS. Essayez plus tard.';
        } else if (err.status === 400) {
          message = 'Requête invalide à l\'API ORS. Vérifiez les coordonnées.';
        }
        this.snackBar.open(message, 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private calculateManualDistance(orders: Ordre[], orderedJobs: number[]): number {
    let totalDistance = 0;
    const points = [
      {
        longitude: orders[0].longitudeDepart,
        latitude: orders[0].latitudeDepart
      },
      ...orderedJobs.map(jobId => {
        const order = orders[jobId - 1];
        return {
          longitude: order.longitudeArrivee,
          latitude: order.latitudeArrivee
        };
      })
    ];

    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += this.haversineDistance(
        points[i].latitude,
        points[i].longitude,
        points[i + 1].latitude,
        points[i + 1].longitude
      );
    }

    return totalDistance * 1000; // Convert km to meters
  }

  private calculateManualDuration(orders: Ordre[], totalDistanceKm: number): number {
    // Try to use tempsAssocie or tempsEstimeTrajet if available
    const totalOrderTime = orders.reduce((sum, order) => {
      if (order.tempsAssocie) {
        return sum + order.tempsAssocie / 60; // Convert minutes to hours
      } else if (order.tempsEstimeTrajet) {
        return sum + parseFloat(order.tempsEstimeTrajet); // Assume hours
      }
      return sum;
    }, 0);

    if (totalOrderTime > 0) {
      return totalOrderTime + (orders.length * 5 / 60); // Add 5 minutes per stop
    }

    // Fallback: Estimate using distance and average speed (60 km/h)
    const averageSpeed = 60; // km/h
    return (totalDistanceKm / averageSpeed) + (orders.length * 5 / 60); // Add 5 minutes per stop
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }
}