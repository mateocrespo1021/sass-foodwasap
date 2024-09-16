import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../auth/services/auth.service';
import { Plan } from '../../../shared/interfaces/plan.interface';
import { TenantService } from '../../../admin/services/tenant.service';
import { Tenant } from '../../../admin/interfaces/tenant.interface';
import { PlanService } from '../../../shared/services/plan.service';

declare var paypal: any;
@Component({
  selector: 'app-modal-payment-methods',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './modal-payment-methods.component.html',
  styleUrl: './modal-payment-methods.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalPaymentMethodsComponent implements OnInit {
  private planService = inject(PlanService);
  private tenantService = inject(TenantService);
  private authService = inject(AuthService);

  get currentTenant() {
    return this.tenantService.getCurrentTenant();
  }

  @ViewChild('paypal', { static: true }) paypalElement?: ElementRef;
  //El plan quee escogio
  @Input() plan!: Plan;
  visible: boolean = false;

  showDialog() {
    this.visible = true;
    if (this.plan.price != 0) {
      this.initializePayPalButton();
    } else {
      this.authService.getUserAuth().subscribe((result) => {
        if (result) {
          const tenant = this.tenantFinal;
          tenant.id_user = result;
          //Guardar el tenant
          this.tenantService.addTenant(tenant).subscribe((tenant)=>{
            console.log(tenant);
            
          })
        }
      });
    }
  }

  get tenantFinal(): Tenant {
    return {
      business_name: this.currentTenant()?.business_name,
      country: this.currentTenant()?.country,
      tel: this.currentTenant()?.tel,
      terms_accepted: this.currentTenant()?.terms_accepted,
      id_plan: this.plan.id,
    };
  }

  ngOnInit(): void {}

  initializePayPalButton() {
    if (this.paypalElement && this.visible) {
      paypal
        .Buttons({
          style: {
            color: 'gold',
            shape: 'rect',
            layout: 'vertical',
          },
          createOrder: (data: any, actions: any) => {
            const createOrderPayload = {
              purchase_units: [
                {
                  amount: {
                    description: 'COMPRAR POR EL ECOMMERCE',
                    value: this.plan.price,
                    currency_code: 'USD',
                  },
                },
              ],
            };
            return actions.order.create(createOrderPayload);
          },
          onApprove: async (data: any, actions: any) => {
           //Pago Realizado correctamente
           this.authService.getUserAuth().subscribe((result) => {
            if (result.user) {
               const tenant = this.tenantFinal;
              tenant.id_user = result.user.id;
              //Guardar el tenant
              this.tenantService.addTenant(tenant).subscribe((tenant)=>{
                console.log(tenant);
                
              })
              
            }
            
            // if (result) {
            //   const tenant = this.tenantFinal;
            //   tenant.id_user = result;
            //   //Guardar el tenant
            //   this.tenantService.addTenant(tenant).subscribe((tenant)=>{
            //     console.log(tenant);
                
            //   })
            // }
          });
          },
          onError: (err: any) => {
            console.error(
              'An error prevented the buyer from checking out with PayPal'
            );
          },
        })
        .render(this.paypalElement.nativeElement);
    }
  }
}
