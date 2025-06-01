import { Component, HostListener } from '@angular/core';
import { LanguageService } from '../services/langue.service';


@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {
  currentLanguage: string = 'fr';
  showOptions = false;

  constructor(private languageService: LanguageService) {
    this.currentLanguage = this.languageService.getCurrentLanguage();
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  selectLanguage(lang: string) {
    this.currentLanguage = lang;
    this.languageService.changeLanguage(lang);
    this.showOptions = false;
  }

  getFlagImage(lang: string): string {
    return lang === 'fr' ? 'téléchargement (1).jpg' : 'téléchargement (8).jpg';
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.language-selector')) {
      this.showOptions = false;
    }
  }
}