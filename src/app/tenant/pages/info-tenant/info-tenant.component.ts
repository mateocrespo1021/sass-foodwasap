import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { AsideInfoComponent } from '../../components/aside-info/aside-info.component';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorService } from '../../../shared/services/validator.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { TenantService } from '../../../admin/services/tenant.service';
import { Tenant } from '../../../admin/interfaces/tenant.interface';

declare var intlTelInput: any;
@Component({
  selector: 'app-info-tenant',
  standalone: true,
  imports: [CommonModule, InputTextModule,CheckboxModule,AsideInfoComponent,ButtonModule,ReactiveFormsModule,ToastModule],
  templateUrl: './info-tenant.component.html',
  styleUrl: './info-tenant.component.scss',
})
export class InfoTenantComponent implements AfterViewInit , OnInit{
  fb = inject(FormBuilder)
  validatorService = inject(ValidatorService);
  messageService = inject(MessageService);
  tenantService = inject(TenantService)
  router = inject(Router)

  
  private isBrowser: boolean;
  public formInfo !: FormGroup
  private iti: any;
  public repeat !: boolean
  

  get currentTenant(){
  return this.tenantService.getCurrentTenant()
  }

  //Metodo para verificar que no se repita el nombre de negocio
  //Si es falso esta repetido y no es valido
  onKeyPress(searchTerm: string) {
    this.tenantService.getExistBusiness(searchTerm).subscribe((result)=>{
      if (result) {
        this.formInfo.patchValue({
          noRepeat : false
        })
        //Se repite por eso es true para mostrar mensaje en pantalla
        this.repeat = true
        return
      }

      this.formInfo.patchValue({
        noRepeat : true
      })
      
      this.repeat=false
    })
    
  }

  @ViewChild('phoneInput', { static: false }) phoneInput!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.formInfo = this.fb.group({
      name : ['' , [Validators.required]],
      phone : ['' , [Validators.required , Validators.pattern(/^\+?[1-9]\d{6,14}$/)]],
      terms : [false ,[Validators.requiredTrue]],
      country : ['' , [Validators.required]],
      noRepeat : [false ,[Validators.requiredTrue]]
    })
  }
 

  ngAfterViewInit(): void {
    //Inicializa el numero de telefono
    if (this.isBrowser) {
      const input = this.phoneInput.nativeElement;
      this.iti = intlTelInput(input, {
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.8.0/build/js/utils.js',
      });

      input.addEventListener('change', () => {
        const fullNumber = this.iti.getNumber();
        const countryData = this.iti.getSelectedCountryData();
        this.formInfo.patchValue({
          phone: fullNumber,
          country : countryData
        });
      });
    }
  }

  isValidField(field: string) {
    return this.validatorService.isValidField(this.formInfo, field);
  }

  getFieldError(field: string) {
    return this.validatorService.getFieldError(this.formInfo, field);
  }

  getTenantForm() : Tenant{
   return {
    business_name:this.formInfo.get('name')?.value,
    tel:this.formInfo.get('phone')?.value,
    country: JSON.stringify(this.formInfo.get('country')?.value),
    terms_accepted:this.formInfo.get('terms')?.value == false ? 0 : 1,
   }
  }

  saveTenant(){
   
    //Validamos el formulario
     if (!this.formInfo.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Para continuar ingrese todos los campos y acepte los Términos & condiciones y Política de privacidad.',
        detail: '',
      });
      return
     }

  
     
    //Guardamos el tenant en el signal para ir a la ventana planes para capturar el id del plan
    this.currentTenant.set(this.getTenantForm())
    this.router.navigateByUrl('/plan-tenant') 
  }
}
