import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ValidatorService } from '../../../shared/services/validator.service';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { Register } from '../../interfaces/register.interface';
import { AsideRegisterComponent } from '../../components/aside-register/aside-register.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-register-tenant',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    ToastModule,
    RippleModule,
    AsideRegisterComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './register-tenant.component.html',
  styleUrl: './register-tenant.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterTenantComponent implements OnInit {
  authService = inject(AuthService);
  validatorService = inject(ValidatorService);
  messageService = inject(MessageService);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);

  formRegister!: FormGroup;
  showMessageValidator: boolean = false;
  loadingSpinner: boolean = false;

  ngOnInit(): void {
    this.formRegister = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmed: [
          '',
          [Validators.required, Validators.minLength(8)],
        ],
      },
      {
        validator: this.validatorService.passwordMatchValidator(
          'password',
          'password_confirmed'
        ),
      }
    );
  }

  passwordType: string = 'password';
  confirmPasswordType: string = 'password';

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordType =
        this.passwordType === 'password' ? 'text' : 'password';
    } else if (field === 'confirmPassword') {
      this.confirmPasswordType =
        this.confirmPasswordType === 'password' ? 'text' : 'password';
    }
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.formRegister, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.formRegister, field);
  }

  convertFormGroupToRegister(form: FormGroup): Register {
    return {
      name: form.get('name')?.value,
      email: form.get('email')?.value,
      password: form.get('password')?.value,
      password_confirmation: form.get('password_confirmed')?.value, // Asegúrate de que el nombre del campo coincida
    };
  }

  onSubmitRegister() {
    if (!this.formRegister.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Por favor, revisa los campos resaltados.',
        detail: '',
      });
      return;
    }

    //Form Valido
    this.loadingSpinner = true;
    this.authService
      .register(this.convertFormGroupToRegister(this.formRegister))
      .subscribe({
        next: (response) => {
          console.log(response);
          
        },
        error: (error) => {
          try {
            const errorObj = JSON.parse(error.message);
            if (errorObj.email && Array.isArray(errorObj.email)) {
              this.loadingSpinner = false;
              this.messageService.add({
                severity: 'error',
                summary: 'El Email ya esta registrado.',
                detail: '',
              });
              // this.errorMessage = errorObj.email[0];
            } else {
              console.log('Unexpected error structure:', error);
              // this.errorMessage = 'Error inesperado. Inténtalo de nuevo.';
            }
          } catch (e) {
            console.log('Error parsing error message:', e);
            console.log('Original error message:', error.message);
            // this.errorMessage = 'Error inesperado. Inténtalo de nuevo.';
          }
        },
        complete: () => {
          console.log('Registration process completed');
          // Opcionalmente maneja la finalización aquí
          this.loadingSpinner = false;
          this.showMessageValidator = true;
          this.cdr.markForCheck();
        },
      });
  }
}