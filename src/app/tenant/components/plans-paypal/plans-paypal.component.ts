import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ModalPaymentMethodsComponent } from '../modal-payment-methods/modal-payment-methods.component';
import { PlanService } from '../../../shared/services/plan.service';
import { Plan } from '../../../shared/interfaces/plan.interface';


@Component({
  selector: 'app-plans-paypal',
  standalone: true,
  imports: [CommonModule,ButtonModule,ModalPaymentMethodsComponent],
  templateUrl: './plans-paypal.component.html',
  styleUrl: './plans-paypal.component.scss',
})
export class PlansPaypalComponent implements OnInit {
  private planService = inject(PlanService);
 
  plans!: Plan[];
  ngOnInit(): void {
    this.planService.getPlans().subscribe((plans) => {
      this.plans = plans.map((plan) => {
        if (plan.features) {
          plan.features = plan.features.toString().split(',');
        }
        return plan;
      });
    });

  
  }
}
