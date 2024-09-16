import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TenantService } from '../../services/tenant.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Me, TenantMe, UserMe } from '../../../auth/interfaces/me.interface';
import { ValidatorService } from '../../../shared/services/validator.service';
import { FileComponent } from '../../components/file/file.component';

declare var intlTelInput: any;
@Component({
  selector: 'app-business-settings',
  standalone: true,
  imports: [CommonModule, InputTextModule, ReactiveFormsModule,FileComponent],
  templateUrl: './business-settings.component.html',
  styleUrl: './business-settings.component.scss',
})
export class BusinessSettingsComponent implements OnInit, AfterViewInit {
  private tenantService = inject(TenantService);
  private authService = inject(AuthService);
  private validatorService = inject(ValidatorService);
  private fb = inject(FormBuilder);
  tenant!: TenantMe;
  user!: UserMe;
  token!: string | null;
  formSettings!: FormGroup;
  private isBrowser: boolean;
  private iti: any;
  public repeat!: boolean;
  @ViewChild('phoneInput', { static: false }) phoneInput!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit(): void {
    this.formSettings = this.fb.group({
      business_name: ['', [Validators.required, Validators.minLength(3)]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[1-9]\d{6,14}$/)],
      ],
      noRepeat: [false, [Validators.requiredTrue]],
    });

    //Obtenemos el user autenticado y el tenant
    this.authService.me().subscribe((me) => {
      if (me.user) {
        this.tenant = me.user.tenant;
        this.user = me.user;
        this.formSettings.patchValue({
          business_name: this.tenant.business_name,
          phone: this.tenant.tel,
        });
      }
    });
  }

  //Metodo para verificar que no se repita el nombre de negocio
  //Si es falso esta repetido y no es valido
  onKeyPress(searchTerm: string) {
    this.tenantService.getExistBusiness(searchTerm).subscribe((result) => {
      //Esta repitiendose pero si escribe su nombree anteerior no pasa nada
      if (
        result &&
        searchTerm.replace(/\s+/g, '').toLowerCase() !=
          this.tenant.business_name.replace(/\s+/g, '').toLowerCase()
      ) {
        this.formSettings.patchValue({
          noRepeat: false,
        });
        //Se repite por eso es true para mostrar mensaje en pantalla
        this.repeat = true;
        return;
      }
      this.formSettings.patchValue({
        noRepeat: true,
      });

      this.repeat = false;
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      const input = this.phoneInput.nativeElement;

      this.iti = intlTelInput(input, {
        initialCountry: 'ec', // Aquí usamos el país almacenado
        utilsScript:
          'https://cdn.jsdelivr.net/npm/intl-tel-input@23.8.0/build/js/utils.js',
      });

      // Si hay un número de teléfono, se establece después de inicializar intlTelInput
      const number = this.formSettings.get('phone')?.value;
      if (number) {
        this.iti.setNumber(number);
      }

      input.addEventListener('change', () => {
        const fullNumber = this.iti.getNumber();
        const countryData = this.iti.getSelectedCountryData();
        this.formSettings.patchValue({
          phone: fullNumber,
          country: countryData,
        });
      });
    }
  }

  handleFileUploaded(files: any) {
    // Aquí puedes manejar los archivos cargados, como enviarlos a un servicio o realizar cualquier otra acción necesaria
    if (files && files.length > 0) {
      const file = files[0]; // Suponiendo que solo se permite subir un archivo
      this.formSettings.patchValue({
        image: file, // Asigna el archivo cargado al campo 'image' del formulario
      });
    }
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.formSettings, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.formSettings, field);
  }
}
