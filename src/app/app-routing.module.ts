import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChauffeurComponent } from './chauffeur/chauffeur.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { ArticleComponent } from './article/article.component';
import { TunisiaMapComponent } from './tunisia-map/tunisia-map.component';
import { TiersComponent } from './tiers/tiers.component';
import { CamionComponent } from './camion/camion.component';
import { OTComponent } from './ot/ot.component';
import { ProfilComponent } from './profil/profil.component';
import { SiteComponent } from './site/site.component';
import { VoyageComponent } from './voyage/voyage.component';
import { MapComponent } from './map/map.component';
import { PlanningComponent } from './planning/planning.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
 
  { path: 'layout', component: LayoutComponent ,
    children: [
    { path: 'home', component: HomeComponent },
    { path: 'chauffeur', component: ChauffeurComponent },
    { path: 'utilisateur', component: UtilisateurComponent },
    { path: 'site', component: SiteComponent },
    { path: 'camion', component: CamionComponent },
    { path: 'OT', component: OTComponent },
    { path: 'map', component: MapComponent },
     { path: 'planning', component: PlanningComponent },
    { path: 'tourne', component: VoyageComponent },
    { path: 'client', component: TiersComponent },
    { path: 'profil', component: ProfilComponent },
    { path: 'article', component: ArticleComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' } // route par défaut
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
