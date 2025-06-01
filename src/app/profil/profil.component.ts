import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/utilisateur.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  user: any | null = null;
  editForm: FormGroup;
  showPassword = false;
  isSaving = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.editForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['']
    });
  }

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.userService.getUserByUsername(username).subscribe({
        next: (user) => {
          this.user = user;
          this.editForm.patchValue({
            username: user.username,
            email: user.email
          });
        },
        error: (err) => console.error('Error loading user', err)
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.editForm.valid && this.user) {
      this.isSaving = true;
      
      const updateData = {
        username: this.editForm.value.username,
        email: this.editForm.value.email,
        password: this.editForm.value.password || undefined
      };

      this.http.put<any>(
        `http://localhost:8082/users/${this.user.id}`, 
        updateData, this.userService.getHeaders()
      ).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.isSaving = false;
          this.editForm.markAsPristine();
          // Afficher un message de succès
        },
        error: (err) => {
          console.error('Update failed', err);
          this.isSaving = false;
          // Afficher un message d'erreur
        }
      });
    }
  }

  resetForm(): void {
    if (this.user) {
      this.editForm.reset({
        username: this.user.username,
        email: this.user.email,
        password: ''
      });
    }
  }
}