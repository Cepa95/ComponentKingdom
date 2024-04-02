import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  errors: string[] | null = null;
  showPassword = false;
  repeatShowPassword = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  complexPassword =
    "(?=^.{6,12}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$";

  registerForm = this.fb.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.pattern(this.complexPassword)],
    ],
    repeatPassword: [
      '',
      [Validators.required, Validators.pattern(this.complexPassword)],
    ],
  });

  onSubmit() {
    const password = this.registerForm?.get('password')?.value;
    const repeatPassword = this.registerForm.get('repeatPassword')?.value;
    if (password !== repeatPassword) {
      this.errors = ['Passwords do not match.'];
      return;
    }
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigateByUrl('/shop'),
      error: (error) => {
        if (error.status === 400 && error.error && error.error.errors) {
          this.errors = error.error.errors;
        } else {
          this.errors = ['An error occurred. Please try again.'];
        }
      },
    });
  }
}
