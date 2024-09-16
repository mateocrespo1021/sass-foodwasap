import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../services/auth.service';
import { ValidatorService } from '../../../shared/services/validator.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    ReactiveFormsModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private validatorsService = inject(ValidatorService);
  private route = inject(Router);
  public formLogin!: FormGroup;
  public showSpinner: boolean = false;

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.formLogin, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.formLogin, field);
  }

  onLogin() {
    if (!this.formLogin.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Datos no validos',
        detail: '',
      });
      return;
    }

    this.showSpinner = true;
    const { email, password } = this.formLogin.value;

    this.authService.login(email, password).subscribe((result) => {
      this.showSpinner = false;
      console.log(result);

      if (result) {
        this.authService.saveLocalStorage(result);
        console.log(result);
        this.messageService.add({
          severity: 'info',
          summary: 'Bienvenido',
          detail: '',
        });
         this.route.navigateByUrl('admin/dashboard');
        return;
      }
      this.messageService.add({
        severity: 'error',
        summary: 'Usuario No Registrado',
        detail: '',
      });
    });
  }
}
