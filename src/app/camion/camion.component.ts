
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Camion, CamionService } from '../services/camion.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-camion',
  templateUrl: './camion.component.html',
  styleUrls: ['./camion.component.css']
})
export class CamionComponent implements OnInit {
  camions: Camion[] = [];
  filteredCamions: Camion[] = [];
  searchTerm: string = '';
  @ViewChild('truckFormRef') truckForm: NgForm | undefined;
  selectedCamion: Camion | null = null;
  modalType: 'view' | 'edit' | 'add' | null = null;

  newCamion: Camion = {
    codeCategorie: '',
    matricule: '',
    statutEntite: 'ACTIF',
    acheteur: '',
    montantAchat: 0,
    montantVente: 0,
    typeEntite: ''
  };

  constructor(
    private camionService: CamionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCamions();
  }

  loadCamions() {
    this.camionService.getAll().subscribe({
      next: (data) => {
        this.camions = data;
        this.filteredCamions = [...this.camions]; // Initialiser la liste filtrée
      },
      error: (err) => {
        this.snackBar.open('Erreur lors du chargement des camions', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  filterCamions() {
    const lowerTerm = this.searchTerm.toLowerCase().trim();
    if (!lowerTerm) {
      this.filteredCamions = [...this.camions];
      return;
    }
    this.filteredCamions = this.camions.filter(camion =>
      (camion.matricule?.toLowerCase().includes(lowerTerm) || '') ||
      (camion.codeCategorie?.toLowerCase().includes(lowerTerm) || '') ||
      (camion.typeEntite?.toLowerCase().includes(lowerTerm) || '') ||
      (camion.acheteur?.toLowerCase().includes(lowerTerm) || '') ||
      (camion.statutEntite?.toLowerCase().includes(lowerTerm) || '')
    );
  }

  openModal(type: 'view' | 'edit' | 'add', camion?: Camion) {
    this.modalType = type;
    this.selectedCamion = camion || null;
    this.newCamion = camion ? { ...camion } : {
      codeCategorie: '',
      matricule: '',
      statutEntite: 'ACTIF',
      acheteur: '',
      montantAchat: 0,
      montantVente: 0,
      typeEntite: ''
    };
    if (this.truckForm) {
      this.truckForm.resetForm(this.newCamion);
    }
  }

  saveCamion() {
    if (this.truckForm?.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (this.newCamion.id) {
      this.camionService.update(this.newCamion.id, this.newCamion).subscribe({
        next: () => {
          this.snackBar.open('Camion modifié avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadCamions();
          this.closeModal();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la modification du camion', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.camionService.create(this.newCamion).subscribe({
        next: () => {
          this.snackBar.open('Camion ajouté avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadCamions();
          this.closeModal();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de l\'ajout du camion', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  deleteCamion(id: number) {
    if (confirm('Confirmer la suppression ?')) {
      this.camionService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Camion supprimé avec succès', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadCamions();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression du camion', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  closeModal() {
    this.modalType = null;
    this.selectedCamion = null;
    this.newCamion = {
      codeCategorie: '',
      matricule: '',
      statutEntite: 'ACTIF',
      acheteur: '',
      montantAchat: 0,
      montantVente: 0,
      typeEntite: ''
    };
    if (this.truckForm) {
      this.truckForm.resetForm(this.newCamion);
    }
  }

  getCamionImage(type?: string): string {
    const lowerType = type?.toLowerCase() || 'default';
    return `/assets/${lowerType}.png`;
  }
}
