import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChauffeurService } from '../services/chauffeur.service';

@Component({
  selector: 'app-chauffeur',
  templateUrl: './chauffeur.component.html',
  styleUrls: ['./chauffeur.component.css']
})
export class ChauffeurComponent implements OnInit {
  chauffeurForm!: FormGroup;
  chauffeurs: any[] = [];
  selectedChauffeur: any = null;
  selectedFile: File | null = null;
  isAddEditPopupVisible: boolean = false; // Pour gérer la visibilité du pop-up d'ajout/édition
  isDetailPopupVisible: boolean = false; // Pour gérer la visibilité du pop-up de détails

  constructor(
    private fb: FormBuilder,
    private chauffeurService: ChauffeurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chauffeurForm = this.fb.group({
      id: [null],
      nom: ['', Validators.required],
      codeUnique: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      photo: [null]
    });

    this.getChauffeurs(); // Charger la liste des chauffeurs
  }

  // Récupérer tous les chauffeurs
  getChauffeurs(): void {
    this.chauffeurService.getAllChauffeurs().subscribe({
      next: (data) => {
        this.chauffeurs = data;
        for (let a of this.chauffeurs) {
          a.photo = a.photo.slice(43); // Modifier le chemin de la photo si nécessaire
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des chauffeurs', err);
      }
    });
  }

  // Sélectionner un chauffeur pour la mise à jour
  onEdit(chauffeur: any): void {
    this.selectedChauffeur = chauffeur;
    this.chauffeurForm.patchValue(chauffeur);
    this.isAddEditPopupVisible = true; // Afficher le pop-up d'édition
  }

  // Sélectionner un fichier photo
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Ajouter ou mettre à jour un chauffeur
  onSubmit(): void {
    if (this.chauffeurForm.invalid || !this.selectedFile) {
      alert('Veuillez remplir tous les champs et ajouter une photo');
      return;
    }

    const chauffeurData = this.chauffeurForm.value;

    if (chauffeurData.id) {
      // Mise à jour du chauffeur
      this.chauffeurService.updateChauffeur(chauffeurData.id, chauffeurData).subscribe({
        next: () => {
          alert('Chauffeur mis à jour avec succès');
          this.getChauffeurs();
          this.chauffeurForm.reset();
          this.isAddEditPopupVisible = false; // Fermer le pop-up
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du chauffeur', err);
        }
      });
    } else {
      // Création du chauffeur
      this.chauffeurService.addChauffeur(chauffeurData, this.selectedFile!).subscribe({
        next: () => {
          alert('Chauffeur ajouté avec succès');
          this.getChauffeurs();
          this.chauffeurForm.reset();
          this.isAddEditPopupVisible = false; // Fermer le pop-up
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du chauffeur', err);
        }
      });
    }
  }

  // Supprimer un chauffeur
  onDelete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) {
      this.chauffeurService.deleteChauffeur(id).subscribe({
        next: () => {
          alert('Chauffeur supprimé avec succès');
          this.getChauffeurs();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du chauffeur', err);
        }
      });
    }
  }

  // Afficher les détails d'un chauffeur dans un pop-up
  viewDetails(chauffeur: any): void {
    this.selectedChauffeur = chauffeur;
    this.isDetailPopupVisible = true; // Afficher le pop-up de détails
  }

  // Fermer le pop-up de détails
  closeDetailPopup(): void {
    this.isDetailPopupVisible = false;
    this.selectedChauffeur = null; // Réinitialiser le chauffeur sélectionné
  }

  // Fermer le pop-up d'ajout/édition
  closeAddEditPopup(): void {
    this.isAddEditPopupVisible = false;
    this.chauffeurForm.reset();
  }
}
