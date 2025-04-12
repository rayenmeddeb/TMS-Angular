export interface Chauffeur {
    id?: number;
    nom: string;
    telephone: string;
    email: string;
    photo?: string;
    codeCategorie?: string;
    codeUnique?: string;
    villeResidence?: string;
    statut?: string;
    codeService?: string;
    codeSiteAffectation?: string;
    identifiantVille?: string;
    dateEntree?: Date | string;
    dateSortie?: Date | string | null;
    dateNaissance?: Date | string;
    dateValiditeFCO?: Date | string;
    dateValiditeFIMO?: Date | string;
    telephoneProfessionnel?: string;
    identifiantExterne?: string;
    adresse?: string;
    adresseComplementaire?: string;
    codePostal?: string;
    typeEmploi?: string;
    situationProfessionnelle?: string;
  }