import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PlansPaypalComponent } from '../../../tenant/components/plans-paypal/plans-paypal.component';
import { TenantMe, UserMe } from '../../../auth/interfaces/me.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { TenantService } from '../../services/tenant.service';
import { SubscriptionService } from '../../services/subscription.service';
import { Subscription } from '../../interfaces/subscription.interface';
import { PlanService } from '../../../shared/services/plan.service';
import { Plan } from '../../../shared/interfaces/plan.interface';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule, PlansPaypalComponent],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss',
})
export class PlanComponent implements OnInit {
  tenant!: TenantMe;
  user!: UserMe;
  subscription !: Subscription
  plan!:Plan | undefined
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
  private subscriptionService = inject(SubscriptionService)
  private plansService = inject(PlanService)
  ngOnInit(): void {
    // Obtenemos el user autenticado y el tenant
    this.authService.me().subscribe((me) => {
      if (me.user) {
        this.tenant = me.user.tenant;
        this.user = me.user;
        this.subscriptionService.getSubscriptionById(this.tenant.id).subscribe((subs) => {
          this.subscription = subs

          this.plansService.getPlanById(this.subscription.id_plan).subscribe((plan)=>{
            this.plan = plan
          })
        })
      }
    });
  }
}
