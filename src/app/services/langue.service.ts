import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(private translate: TranslateService) {
    // Langue par défaut
    translate.setDefaultLang('fr');
    // Langue actuelle
    translate.use('fr');
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang); // Sauvegarder le choix
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang;
  }
}