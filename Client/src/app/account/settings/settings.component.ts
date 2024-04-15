import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  errors: string[] | null = null;
  showPassword = false;
  changeShowPassword = false;
  repeatShowPassword = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  complexPassword =
    "(?=^.{6,12}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$";

  changePasswordForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: [
      '',
      [Validators.required, Validators.pattern(this.complexPassword)],
    ],
    repeatPassword: [
      '',
      [Validators.required, Validators.pattern(this.complexPassword)],
    ],
  });

  changePassword() {
    if (this.changePasswordForm.invalid) {
      return;
    }
  
    const oldPassword = this.changePasswordForm.get('oldPassword')?.value || '';
    const newPassword = this.changePasswordForm.get('newPassword')?.value || '';
    const repeatPassword = this.changePasswordForm.get('repeatPassword')?.value || '';

    if (newPassword !== repeatPassword) {
      this.errors = ['New passwords do not match.'];
      return;
    }

    if (newPassword === oldPassword) {
      this.errors = ['New password must be different from old password.'];
      return;
    }

    this.accountService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.accountService.logout();
      },
      error: (error) => {
        if (error.status === 400 && error.error && error.error.errors) {
          this.errors = error.error.errors;
        } else {
          console.log(error)
          this.errors = ['An error occurred. Please try again.'];
        }
      },
    });
  }
}