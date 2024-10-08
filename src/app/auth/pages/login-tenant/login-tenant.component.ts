import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidatorService } from '../../../shared/services/validator.service';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AsideLoginComponent } from '../../components/aside-login/aside-login.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-login-tenant',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    RippleModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    AsideLoginComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './login-tenant.component.html',
  styleUrl: './login-tenant.component.scss',
})
export class LoginTenantComponent implements OnInit {
  fb = inject(FormBuilder);
  validatorService = inject(ValidatorService);
  messageService = inject(MessageService);

  authService = inject(AuthService);

  route = inject(ActivatedRoute);
  router = inject(Router);
  formLogin!: FormGroup;
  code!: any;
  showMessageVerified: boolean = false;
  passwordType: string = 'password';
  confirmPasswordType: string = 'password';
  loadingSpinner: boolean = false;
  token: string | any = null;

  initializeGoogleSignIn() {
    window['google'].accounts.id.initialize({
      client_id:
        '1061570549242-b9179hiso5eu6ijj7ru6p5dfrkjsget9.apps.googleusercontent.com', // Tu client_id
      callback: (response: any) => this.handleOauthResponse(response),
      context: 'signin',
      ux_mode: 'popup',
      itp_support: true,
    });

    // Renderizar el botón de inicio de sesión
    window['google'].accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      }
    );
  }

  //Inicio sesion google , pasarle el token a la api
  handleOauthResponse(response: any) {
    if (response.credential) {
      console.log(response.credential);
      this.authService
      .loginGoogle(
        response.credential
      )
      .subscribe((result) => {
        this.loadingSpinner = false;
        if (!result.has_tenant) {
          this.router.navigateByUrl('info-tenant');
          return;
        }
        this.router.navigateByUrl('admin/dashboard');
      });
    }
  }

  decodeJWTToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  ngOnInit(): void {
   
    this.initializeGoogleSignIn();
    //Obtengo las variable UID de verificacion
    this.route.queryParamMap.subscribe((params) => {
      this.code = params.get('code');
      if (this.code != null) {
        const data = {
          code: this.code,
        };
        this.authService.verifiedEmailAuth(data).subscribe({
          next: (response) => {
            this.showMessageVerified = true;
          },
          error: (err) => {
            //console.error(err);

          },
        });
      }
    });

    //INicializo el formLogin
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

  onSubmitLogin() {
    if (!this.formLogin.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ingrese todos los campos.',
        detail: '',
      });
      return;
    }

    this.loadingSpinner = true;
    this.authService
      .login(
        this.formLogin.get('email')?.value,
        this.formLogin.get('password')?.value
      )
      .subscribe((result) => {
        //console.log(result);
        this.loadingSpinner = false;
        if (!result.has_tenant) {
          this.router.navigateByUrl('info-tenant');
          return;
        }

        this.router.navigateByUrl('admin/dashboard');
      });
  }

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
    return this.validatorService.isValidField(this.formLogin, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.formLogin, field);
  }
}
