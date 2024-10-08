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
import { ButtonModule } from 'primeng/button';
import { SocialNetworks, Tenant } from '../../interfaces/tenant.interface';
import { environments } from '../../../../environments/environments';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

declare var intlTelInput: any;
@Component({
  selector: 'app-business-settings',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    FileComponent,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './business-settings.component.html',
  styleUrl: './business-settings.component.scss',
})
export class BusinessSettingsComponent implements OnInit, AfterViewInit {
  public baseLogo = environments.baseLogos;
  private tenantService = inject(TenantService);
  private authService = inject(AuthService);
  private validatorService = inject(ValidatorService);
  private messageService = inject(MessageService);
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
      address: ['', [Validators.minLength(3)]],
      image: [''],
      country: ['', [Validators.required]],
      facebook: ['', Validators.minLength(3)],
      instagram: ['', Validators.minLength(3)],
      tiktok: ['', Validators.minLength(3)],
      twitter: ['', Validators.minLength(3)],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[1-9]\d{6,14}$/)],
      ],
      noRepeat: [true, [Validators.requiredTrue]],
    });

    //Obtenemos el user autenticado y el tenant
    this.authService.me().subscribe((me) => {
      if (me.user) {
        this.tenant = me.user.tenant;
        this.user = me.user;
        let socialNetworks = {} as SocialNetworks;
        // Verificar si social_networks es un string y no undefined
        if (typeof this.tenant.social_networks === 'string') {
          try {
            socialNetworks = JSON.parse(this.tenant.social_networks);
          } catch (error) {
            console.error('Error parsing social_networks:', error);
          }
        } else if (this.tenant.social_networks) {
          // Si ya es un objeto, lo usamos directamente
          socialNetworks = this.tenant.social_networks;
        }
        //console.log(socialNetworks);

        this.formSettings.patchValue({
          business_name: this.tenant.business_name,
          phone: this.tenant.tel,
          country: this.tenant.country,
          address: this.tenant.address,
          facebook: socialNetworks.facebook ?? '',
          instagram: socialNetworks.instagram ?? '',
          tiktok: socialNetworks.tiktok ?? '',
          twitter: socialNetworks.twitter ?? '',
        });
      }
    });
  }

  get tenantForm() {
    const formValues = this.formSettings.value;

    const formData = new FormData();

    // Si existe business_name, se agrega al FormData
    if (formValues.business_name)
      formData.append('business_name', formValues.business_name);
    if (formValues.address) formData.append('address', formValues.address);
    if (formValues.image) formData.append('logo', formValues.image);
    if (formValues.phone) formData.append('tel', formValues.phone);

    // Crear el JSON de redes sociales solo si tiene valores
    const socialNetworks: any = {};
    if (formValues.facebook) socialNetworks['facebook'] = formValues.facebook;
    if (formValues.instagram)
      socialNetworks['instagram'] = formValues.instagram;
    if (formValues.tiktok) socialNetworks['tiktok'] = formValues.tiktok;
    if (formValues.twitter) socialNetworks['twitter'] = formValues.twitter;

    // Si el objeto de redes sociales tiene valores, se convierte a JSON y se agrega al FormData
    if (Object.keys(socialNetworks).length > 0) {
      formData.append('social_networks', JSON.stringify(socialNetworks));
    }

    return formData;
  }

  saveSettings() {
    // console.log(this.formSettings.value);

    if (!this.formSettings.valid) return;

    this.tenantService
      .updateTenant(this.tenantForm, this.tenant.id)
      .subscribe((result) => {
        this.messageService.add({
          severity: 'info',
          summary: '',
          detail: 'Guardado Correctamente',
        });
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

      setTimeout(() => {
        const countryList = document.querySelector(
          '.iti__country-list'
        ) as HTMLElement;
        if (countryList) {
          countryList.style.backgroundColor = 'black';
          countryList.style.color = '#ccc'
        }
      }, 1000);
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
