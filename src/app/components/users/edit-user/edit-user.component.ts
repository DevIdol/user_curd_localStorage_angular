import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  userId!: number;
  userData: any;
  userForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      const usersData = localStorage.getItem('users');
      if (usersData) {
        const users: User[] = JSON.parse(usersData);
        this.userData = users.find((user) => user.id === this.userId);
      }
      this.userForm = this.formBuilder.group({
        name: [this.userData.name, Validators.required],
        email: [this.userData.email, [Validators.required, Validators.email]],
        password: [this.userData.password, Validators.required],
        confirmPass: [this.userData.confirmPass, Validators.required],
        gender: [this.userData.gender, Validators.required],
        team: [this.userData.team, Validators.required],
        role: [this.userData.role, Validators.required],
        hobby: [this.userData.hobby, Validators.required],
        dob: [this.userData.dob, Validators.required],
        createdAt: [this.userData.createdAt, Validators.required],
      });
    });
  }

  onSubmit() {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user) => {
      if (user.id === this.userId) {
        return { ...user, ...this.userForm.value };
      } else {
        return user;
      }
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    this.router.navigate(['/user-list']);
  }
}
