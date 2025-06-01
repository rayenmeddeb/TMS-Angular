import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChauffeurService } from '../services/chauffeur.service';
import { Chauffeur } from '../models/chauffeur.model';

@Component({
  selector: 'app-chauffeur',
  templateUrl: './chauffeur.component.html',
  styleUrls: ['./chauffeur.component.css'],
})
export class ChauffeurComponent implements OnInit {
  chauffeurForm!: FormGroup;
  searchForm!: FormGroup; // Added for search
  chauffeurs: Chauffeur[] = [];
  filteredChauffeurs: Chauffeur[] = []; // Added for filtered data
  selectedChauffeur: Chauffeur | null = null;
  isAddEditPopupVisible: boolean = false;
  isDetailPopupVisible: boolean = false;
  statutOptions: string[] = ['ACTIF', 'NON_ACTIF', 'EN_CONGE'];

  constructor(
    private fb: FormBuilder,
    private chauffeurService: ChauffeurService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.getChauffeurs();
  }

  initializeForms(): void {
    // Chauffeur form
    this.chauffeurForm = this.fb.group({
      id: [null],
      codeUnique: ['', [Validators.required, Validators.minLength(8)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      villeResidence: ['', Validators.required],
      codeService: ['', Validators.required],
      codeSite: ['', Validators.required],
      dateEntree: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      telephoneProfessionnel: [''],
      identifiantExterne: [''],
      adresse: ['', Validators.required],
      adresseComplementaire: [''],
      codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      typeEmploi: ['', Validators.required],
      statut: ['', Validators.required],
      situationProfessionnelle: [''],
      numeroPermis: ['', [Validators.required, Validators.minLength(5)]],
      kilometrageParcouru: [0, [Validators.required, Validators.min(0)]],
    });

    // Search form
    this.searchForm = this.fb.group({
      searchQuery: [''],
    });

    // Subscribe to search query changes
    this.searchForm.get('searchQuery')?.valueChanges.subscribe((query) => {
      this.filterChauffeurs(query);
    });
  }

  getChauffeurs(): void {
    this.chauffeurService.getAllChauffeurs().subscribe({
      next: (data) => {
        this.chauffeurs = data.map(chauffeur => ({
          ...chauffeur,
          photo: chauffeur.photo ? `http://localhost:8023/${chauffeur.photo.slice(43)}` : null,
        }));
        this.filteredChauffeurs = [...this.chauffeurs]; // Initialize filtered data
      },
      error: (err) => {
        console.error('Erreur lors du chargement des chauffeurs', err);
        alert('Erreur lors du chargement des chauffeurs');
      },
    });
  }

  filterChauffeurs(query: string): void {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) {
      this.filteredChauffeurs = [...this.chauffeurs];
      return;
    }

    this.filteredChauffeurs = this.chauffeurs.filter(chauffeur =>
      (chauffeur.nom?.toLowerCase().includes(lowerQuery) ||
       chauffeur.codeUnique?.toLowerCase().includes(lowerQuery) ||
       chauffeur.codeSite?.toLowerCase().includes(lowerQuery))
    );
  }

  onEdit(chauffeur: Chauffeur): void {
    this.selectedChauffeur = chauffeur;
    this.chauffeurForm.patchValue({
      ...chauffeur,
      dateEntree: chauffeur.dateEntree ? new Date(chauffeur.dateEntree).toISOString().split('T')[0] : '',
      dateNaissance: chauffeur.dateNaissance ? new Date(chauffeur.dateNaissance).toISOString().split('T')[0] : '',
    });
    this.isAddEditPopupVisible = true;
  }

  onSubmit(): void {
    if (this.chauffeurForm.invalid) {
      this.chauffeurForm.markAllAsTouched();
      alert('Veuillez remplir tous les champs requis correctement');
      return;
    }

    const chauffeurData = this.chauffeurForm.value;

    if (chauffeurData.id) {
      this.chauffeurService.updateChauffeur(chauffeurData.id, chauffeurData).subscribe({
        next: () => {
          alert('Chauffeur mis à jour avec succès');
          this.getChauffeurs();
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du chauffeur', err);
          alert('Erreur lors de la mise à jour du chauffeur');
        },
      });
    } else {
      console.log('Sending chauffeurData:', chauffeurData);
      this.chauffeurService.addChauffeur(chauffeurData).subscribe({
        next: () => {
          alert('Chauffeur ajouté avec succès');
          this.getChauffeurs();
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du chauffeur', err);
          alert('Erreur lors de l\'ajout du chauffeur');
        },
      });
    }
  }

  onDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) {
      this.chauffeurService.deleteChauffeur(id).subscribe({
        next: () => {
          alert('Chauffeur supprimé avec succès');
          this.getChauffeurs();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du chauffeur', err);
          alert('Erreur lors de la suppression du chauffeur');
        },
      });
    }
  }

  viewDetails(chauffeur: Chauffeur): void {
    this.selectedChauffeur = chauffeur;
    this.isDetailPopupVisible = true;
  }

  closeDetailPopup(): void {
    this.isDetailPopupVisible = false;
    this.selectedChauffeur = null;
  }

  closeAddEditPopup(): void {
    this.isAddEditPopupVisible = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.chauffeurForm.reset();
    this.selectedChauffeur = null;
    this.isAddEditPopupVisible = false;
  }
}