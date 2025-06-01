import { Ordre } from "./ordre";

export interface Voyage {
    id?: number;
    numeroVoyage: string;
    ordres: Ordre[]; // Array of full Ordre objects
    kilometrageTotal: number;
    tempsTotal?: number;
    codeChauffeur: string;
    codeCamion: string;
    dateCreation: Date;
    endDate?: Date; // ISO date string
  }