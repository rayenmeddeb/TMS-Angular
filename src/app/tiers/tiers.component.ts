import { Component, OnInit } from '@angular/core';
import { Tier } from '../models/tier';
import { TierService } from '../services/tier.service';

@Component({
  selector: 'app-tiers',
  templateUrl: './tiers.component.html',
  styleUrls: ['./tiers.component.css']
})
export class TiersComponent implements OnInit {
  tiers: Tier[] = [];
  searchTerm: string = '';
  showAddModal: boolean = false;
  showDetails: boolean = false;
  showDelete: boolean = false;
  selectedTier?: Tier;
  newTier: Tier = { codePrincipal: '', nomContactPrincipal: '', codePays: '', dateCreation: new Date().toISOString().substring(0, 10) };

  constructor(private tierService: TierService) {}

  ngOnInit() {
    this.getAllTiers();
  }

  getAllTiers() {
    this.tierService.getAll().subscribe({
      next: (data) => {
        this.tiers = data;
      },
      error: (error) => {
        console.error('Error fetching tiers:', error);
      }
    });
  }

  filteredTiers() {
    if (!this.searchTerm.trim()) return this.tiers;
    const term = this.searchTerm.toLowerCase();
    return this.tiers.filter(t =>
      (t.codePrincipal?.toLowerCase() || '').includes(term) ||
      (t.nomContactPrincipal?.toLowerCase() || '').includes(term)
    );
  }

  openAddModal() {
    this.newTier = { codePrincipal: '', nomContactPrincipal: '', codePays: '', dateCreation: new Date().toISOString().substring(0, 10) };
    this.showAddModal = true;
  }

  openDetailsModal(tier: Tier) {
    this.selectedTier = tier;
    this.showDetails = true;
  }

  openDeleteModal(tier: Tier) {
    this.selectedTier = tier;
    this.showDelete = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  closeDetailsModal() {
    this.showDetails = false;
  }

  closeDeleteModal() {
    this.showDelete = false;
  }

  createTier() {
    if (!this.newTier.codePrincipal || !this.newTier.nomContactPrincipal || !this.newTier.codePays) {
      console.warn('Required fields are missing');
      return;
    }
    this.tierService.create(this.newTier).subscribe({
      next: () => {
        this.getAllTiers();
        this.closeAddModal();
        this.newTier = { codePrincipal: '', nomContactPrincipal: '', codePays: '', dateCreation: new Date().toISOString().substring(0, 10) };
      },
      error: (error) => {
        console.error('Error creating tier:', error);
      }
    });
  }

  deleteTier() {
    if (this.selectedTier?.id) {
      this.tierService.delete(this.selectedTier.id).subscribe({
        next: () => {
          this.getAllTiers();
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting tier:', error);
        }
      });
    }
  }
}