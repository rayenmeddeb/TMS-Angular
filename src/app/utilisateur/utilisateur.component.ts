import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/utilisateur.service';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.css'
})
export class UtilisateurComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = {};
  showModal = false;

  constructor(private userService: UserService) {}
 user= {
    "id": 6,
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "$2a$10$7y0A.GAMDKs6DFc0edGAOOY0hgqI9cU/Iy8mXnI3DSzRhoGUjFC3K",
    "role": "USER"
}
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
    });
  }

  openModal() {
    this.selectedUser = {};
    this.showModal = true;
  }

  editUser(user: any) {
    this.selectedUser = { ...user };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = {};
  }

  saveUser() {
    if (this.selectedUser.id) {
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(() => {
        this.loadUsers();
        this.closeModal();
      });
    } else {
      this.userService.createUser(this.selectedUser).subscribe(() => {
        this.loadUsers();
        this.closeModal();
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }


  getInitials(user: any): string {
    const name = user.firstname || user.username || user.email || '';
    return name.substring(0, 2).toUpperCase();
  }
  
  getColor(seed: number): string {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#03a9f4', '#009688', '#4caf50', '#ff9800', '#795548'];
    return colors[seed % colors.length];
  }
}