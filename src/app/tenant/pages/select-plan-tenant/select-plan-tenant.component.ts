import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TenantService } from '../../../admin/services/tenant.service';
import { PlansPaypalComponent } from '../../components/plans-paypal/plans-paypal.component';


@Component({
  selector: 'app-select-plan-tenant',
  standalone: true,
  imports: [
    CommonModule,
    PlansPaypalComponent,
    
  ],
  templateUrl: './select-plan-tenant.component.html',
  styleUrl: './select-plan-tenant.component.scss',
})
export class SelectPlanTenantComponent implements OnInit{
  router = inject(Router)
  private tenantService = inject(TenantService)

 
  ngOnInit(): void {
    
  }

 }
