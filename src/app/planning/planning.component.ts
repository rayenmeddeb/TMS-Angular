import { Component, OnInit } from '@angular/core';
import { Voyage } from '../models/voyage';
import { VoyageService } from '../services/voyage.service';
import { addHours, differenceInMinutes } from 'date-fns';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {
  voyages: Voyage[] = [];
  filteredVoyages: Voyage[] = [];
  hours = Array.from({ length: 24 }, (_, i) => i); // 0 à 23
  selectedDate: string = ''; // IMPORTANT : string (format yyyy-MM-dd)
  selectedVoyage: Voyage | null = null;

  constructor(private voyageService: VoyageService) {}

  ngOnInit(): void {
    this.loadVoyages();
    this.selectedDate = this.formatDate(new Date()); // valeur par défaut = aujourd'hui
  }

  loadVoyages(): void {
    this.voyageService.getAllVoyages().subscribe((data: Voyage[]) => {
      this.voyages = data.map(voyage => {
        voyage.dateCreation = new Date(voyage.dateCreation);
        voyage.endDate = addHours(voyage.dateCreation, voyage.tempsTotal || 0);
        return voyage;
      });
      this.filterVoyagesByDate();
    });
  }

  // Convertit une Date JS en string 'yyyy-MM-dd' pour input type=date
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  filterVoyagesByDate(): void {
    if (!this.selectedDate) {
      this.filteredVoyages = [...this.voyages];
      return;
    }
    const selectedDateObj = new Date(this.selectedDate + 'T00:00:00'); // forcer minuit

    this.filteredVoyages = this.voyages.filter(voyage => {
      if (!voyage.dateCreation) return false;

      // Extraire la date (sans l'heure) de la dateCreation
      const voyageDate = new Date(
        voyage.dateCreation.getFullYear(),
        voyage.dateCreation.getMonth(),
        voyage.dateCreation.getDate()
      );

      return voyageDate.getTime() === selectedDateObj.getTime();
    });
  }

  getOffsetHours(voyage: Voyage): number {
    return voyage.dateCreation.getHours();
  }

  getColSpan(voyage: Voyage): number {
    if (!voyage.dateCreation || !voyage.endDate) return 1;
    const minutes = differenceInMinutes(voyage.endDate, voyage.dateCreation);
    return Math.max(1, Math.ceil(minutes / 60));
  }

  onVoyageClick(voyage: Voyage): void {
    this.selectedVoyage = this.selectedVoyage === voyage ? null : voyage;
  }
}