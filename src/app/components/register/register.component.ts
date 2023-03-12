import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { Role } from 'src/app/interfaces/role.interface';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  roles: Role[] = [
    { value: 'Manager' },
    { value: 'Member' },
    { value: 'User' },
  ];
  hobbies: Array<any> = [
    { value: 'Reading' },
    { value: 'Swimming' },
    { value: 'Cooking' },
  ];
  registerForm: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.registerForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z. ]{3,40}$')],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-z0-9].+@[a-z]+.[a-z]{2,3}'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{5,8}$'
          ),
        ],
      ],
      confirmPass: ['', [Validators.required, this.matchConfirmPassword()]],
      gender: ['', Validators.required],
      team: ['Wordpress', Validators.required],
      role: ['', Validators.required],
      hobby: this.fb.array([], [Validators.required]),
      dob: ['', Validators.required],
    });
  }

  matchConfirmPassword() {
    return (formGroup: FormGroup) => {
      const password = formGroup.get('password');
      const confirmPass = formGroup.get('confirmPass');

      if (password?.value !== confirmPass?.value) {
        confirmPass?.setErrors({ passwordMismatch: true });
      } else {
        confirmPass?.setErrors(null);
      }
    };
  }

  onCheckboxChange(event: MatCheckboxChange) {
    const checkArray: FormArray = this.registerForm.get('hobby') as FormArray;
    if (event.checked) {
      checkArray.push(new FormControl(event.source.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == event.source.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      let users: any[] = JSON.parse(localStorage.getItem('users') ?? '[]');
      const now = new Date();
      const createdAt = this.datePipe.transform(now, 'yyyy/MM/dd hh:mm a');
      let userData = [
        { id: users.length + 1, ...this.registerForm.value, createdAt },
      ];
      users.push(...userData);
      localStorage.setItem('users', JSON.stringify(users));
      this.router.navigate(['/login']);
    }
  }
}
