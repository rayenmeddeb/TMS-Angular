import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ChauffeurComponent } from './chauffeur/chauffeur.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';

import { HomeComponent } from './home/home.component';




// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ArticleComponent } from './article/article.component';
import { TunisiaMapComponent } from './tunisia-map/tunisia-map.component';
import { TiersComponent } from './tiers/tiers.component';
import { CamionComponent } from './camion/camion.component';
import { OTComponent } from './ot/ot.component';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';



import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { ProfilComponent } from './profil/profil.component';
import { SiteComponent } from './site/site.component';
import { VoyageComponent } from './voyage/voyage.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MapComponent } from './map/map.component';
import { PlanningComponent } from './planning/planning.component';


// Fonction pour charger les fichiers de traduction
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChauffeurComponent,
    UtilisateurComponent,
    LayoutComponent,
    NavbarComponent,
    SidebarComponent,
    HomeComponent,
    ArticleComponent,
    TunisiaMapComponent,
    TiersComponent,
    CamionComponent,
    OTComponent,
    LanguageSelectorComponent,
    ProfilComponent,
    SiteComponent,
    VoyageComponent,
    MapComponent,
    PlanningComponent,
   
    
   
   
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  
    BrowserAnimationsModule,
   
    MatButtonModule,
    MatMenuModule,
    NgbModule,
    NgbModalModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatChipsModule,
    MatSelectModule,
    MatProgressSpinnerModule,

    MatCheckboxModule,
    MatSnackBarModule,
    MatRadioModule,
    MatDialogModule,
    
  

    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
   
   
  
  
   
 
    // Font Awesome
    FontAwesomeModule

  ],
 
  providers: [
    provideAnimationsAsync(),
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
