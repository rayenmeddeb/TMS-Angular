import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Site } from '../models/site';
import { SiteService } from '../services/site.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit, AfterViewInit {
  sites: Site[] = [];
  locations: {
    name: string;
    coords: [number, number];
    description: string;
    image?: string;
  }[] = [];
  sitesDataSource = new MatTableDataSource<Site>([]);
  selectedSite: Site | null = null;
  newSite: Site = this.initSite();
  isEditing = false;
  isSaving = false;
  siteForm: FormGroup;
  fieldLabels = {
    sitcode: 'Code',
    sitlibl: 'Nom',
    sitville: 'Ville',
    sitmail: 'Email',
    sitadr1: 'Adresse',
    sitcp: 'Code Postal',
    sittel: 'Téléphone',
    sitfax: 'Fax',
    paycode: 'Code Pays',
    Latitude: 'latitude',
    Longitude: 'longitude'
  };
  @ViewChild('siteDialog') siteDialog!: TemplateRef<any>;
  @ViewChild('detailsDialog') detailsDialog!: TemplateRef<any>;
  private map!: L.Map;
  private markers: L.Marker[] = [];

  constructor(
    private siteService: SiteService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.siteForm = this.fb.group({
      sitcode: ['', Validators.required],
      sitlibl: ['', Validators.required],
      sitville: ['', Validators.required],
      sitmail: ['', [Validators.required, Validators.email]],
      sitadr1: [''],
      sitcp: [''],
      sittel: [''],
      sitfax: [''],
      paycode: [''],
      sitretour: [false],
      Latitude: [null, [Validators.pattern(/^-?\d*\.?\d+$/), this.coordinateValidator(30, 38)]],
      Longitude: [null, [Validators.pattern(/^-?\d*\.?\d+$/), this.coordinateValidator(7, 12)]]
    });
  }

  coordinateValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value === null || value === '') return null;
      const num = parseFloat(value);
      return isNaN(num) || num < min || num > max ? { invalidCoordinate: true } : null;
    };
  }

  ngOnInit(): void {
    this.loadSites();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initSite(): Site {
    return {
      id: null,
      datcrea: '',
      datmodi: '',
      paycode: '',
      quicrea: '',
      quimodi: '',
      reptiecode: '',
      sercode: '',
      sitadr1: '',
      sitadr2: '',
      sitcode: '',
      sitcp: '',
      sitcptembdest: '',
      sitcptembexp: '',
      sitembsercode: '',
      sitembsitcode: '',
      sitembtiepay: '',
      sitfax: '',
      sitgtf: '',
      sitlibl: '',
      sitmail: '',
      sitretour: false,
      sitserarr: '',
      sitserret: '',
      sitsiretedi: '',
      sittel: '',
      sitville: '',
      soccode: '',
      vilident: '',
      latitude: null,
      longitude: null
    };
  }

  initMap(): void {
    const tunisiaCenter: L.LatLngExpression = [34, 9];
    this.map = L.map('map', {
      center: tunisiaCenter,
      zoom: 6.5,
      minZoom: 6,
      maxZoom: 13,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
      maxBounds: L.latLngBounds(L.latLng(30, 7), L.latLng(38, 12))
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(this.map);

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.dialog.openDialogs.length > 0) {
        this.siteForm.patchValue({
          Latitude: e.latlng.lat.toFixed(4),
          Longitude: e.latlng.lng.toFixed(4)
        });
        this.snackBar.open('Coordonnées sélectionnées depuis la carte', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });

    // Initial marker update
    this.updateMarkers();
  }

  updateMarkers(): void {
    // Remove existing markers
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    // Update locations array
    this.locations = this.sites
      .filter(site => site.latitude != null && site.longitude != null && !isNaN(Number(site.latitude)) && !isNaN(Number(site.longitude)))
      .map(site => ({
        name: site.sitlibl || site.sitville || 'Site',
        coords: [Number(site.latitude), Number(site.longitude)] as [number, number],
        description: site.sitadr1 || 'Adresse non spécifiée',
        image: 'assets/default-site.jpg' // Ensure this file exists
      }));

    console.log('Locations for markers:', this.locations);

    // Custom marker icon with fallback
    let customIcon;
    try {
      customIcon = L.icon({
        iconUrl: 'assets/marker.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });
    } catch (error) {
      console.error('Failed to load custom icon, using default:', error);
      customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });
    }

    // Add markers for each location
    this.locations.forEach(loc => {
      const marker = L.marker(loc.coords, {
        icon: customIcon,
        title: loc.name
      }).addTo(this.map);

      marker.bindPopup(`
        <b>${loc.name}</b><br>
        ${loc.description}<br>
        ${loc.image ? `<img src="${loc.image}" alt="${loc.name}" style="width:100%; margin-top:5px;">` : ''}
      `);

      L.circle(loc.coords, {
        color: 'blue',
        fillColor: '#30f',
        fillOpacity: 0.2,
        radius: 2000
      }).addTo(this.map);

      this.markers.push(marker);
      console.log(`Added marker for ${loc.name} at [${loc.coords[0]}, ${loc.coords[1]}]`);
    });

    // Fit bounds to show all markers
    if (this.markers.length > 0) {
      const markerGroup = new L.FeatureGroup(this.markers);
      this.map.fitBounds(markerGroup.getBounds().pad(0.5));
    }
  }

  loadSites() {
    this.siteService.getAll().subscribe({
      next: (data) => {
        this.sites = data;
        this.sitesDataSource.data = data;
        console.log('Sites loaded:', data);
        this.updateMarkers(); // Update markers after loading sites
      },
      error: (err) => {
        console.error('Error loading sites:', err);
        this.snackBar.open('Erreur lors du chargement des sites', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openDetails(site: Site) {
    this.selectedSite = site;
    if (site.latitude != null && site.longitude != null && !isNaN(Number(site.latitude)) && !isNaN(Number(site.longitude))) {
      this.map.setView([Number(site.latitude), Number(site.longitude)], 12);
    }
    this.dialog.open(this.detailsDialog);
  }

  openForm(site?: Site) {
    this.isEditing = !!site;
    this.newSite = site ? { ...site } : this.initSite();
    this.siteForm.patchValue(this.newSite);
    this.dialog.open(this.siteDialog);
  }

  saveSite() {
    if (this.siteForm.valid) {
      this.isSaving = true;
      const siteData = { ...this.newSite, ...this.siteForm.value };
      if (this.isEditing && this.newSite.id) {
        this.siteService.update(this.newSite.id, siteData).subscribe({
          next: () => {
            this.loadSites();
            this.isSaving = false;
            this.closeDialog();
            this.snackBar.open('Site mis à jour avec succès', 'Fermer', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            this.isSaving = false;
            const message = err.error?.message || 'Erreur lors de la mise à jour du site';
            this.snackBar.open(message, 'Fermer', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      } else {
        siteData.id = null;
        this.siteService.create(siteData).subscribe({
          next: () => {
            this.loadSites();
            this.isSaving = false;
            this.closeDialog();
            this.snackBar.open('Site créé avec succès', 'Fermer', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            this.isSaving = false;
            const message = err.error?.message || 'Erreur lors de la création du site';
            this.snackBar.open(message, 'Fermer', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    }
  }

  deleteSite(id: number) {
    if (confirm('Confirmer la suppression ?')) {
      this.siteService.delete(id).subscribe({
        next: () => {
          this.loadSites();
          this.snackBar.open('Site supprimé avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression du site', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}