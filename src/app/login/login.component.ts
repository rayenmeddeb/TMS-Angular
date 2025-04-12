import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

  export class LoginComponent implements OnInit {
    error: string = '';
    err: boolean = false;
    email: string = '';
    password: string = '';
  
    constructor(private authService: AuthService, private router: Router) {}
  
    ngOnInit(): void {
      // rien à faire ici pour l’instant
    }
  
    login(): void {
      this.authService.login(this.email, this.password).subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/chauffeur']);
          this.error = '';
          this.err = false;
        },
        (error) => {
          console.error('Login failed', error);
          this.error = 'Vérifiez vos champs';
          this.err = true;
        }
      );
    }
  }
  

