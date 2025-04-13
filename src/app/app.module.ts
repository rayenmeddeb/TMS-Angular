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


import { HomeComponent } from './home/home.component';




// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ArticleComponent } from './article/article.component';


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
    
   
   
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
     MatIconModule,
    MatButtonModule,
    MatMenuModule,
   
  
  
   
 
    // Font Awesome
    FontAwesomeModule

  ],
 
  providers: [
    provideAnimationsAsync(),
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
