import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup | any;
  hide: boolean = true;
  invalidUser!: string;

  constructor(private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-z0-9].+@[a-z]+.[a-z]{2,3}'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{5,8}$'
        ),
      ]),
    });
  }

  ngOnInit(): void {}

  checkUser(email: string, password: string): boolean {
    let users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find((u) => u.email === email && u.password === password);
    return !!user;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      if (
        this.checkUser(
          this.loginForm.value.email,
          this.loginForm.value.password
        )
      ) {
        this.router.navigate(['/user-list']);
      } else {
        this.invalidUser = 'Invalid email or password.';
      }
    }
  }
}
