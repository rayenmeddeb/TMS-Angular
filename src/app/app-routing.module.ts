import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChauffeurComponent } from './chauffeur/chauffeur.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
 
  { path: 'layout', component: LayoutComponent ,
    children: [
    { path: 'home', component: HomeComponent },
    { path: 'chauffeur', component: ChauffeurComponent },
    { path: 'utilisateur', component: UtilisateurComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' } // route par défaut
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
