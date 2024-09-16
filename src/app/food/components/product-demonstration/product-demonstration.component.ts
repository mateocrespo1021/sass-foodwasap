import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Category } from '../../../admin/interfaces/category.interface';
import { CategoriesService } from '../../../admin/services/categories.service';
import { DemostrationComponent } from '../demostration/demostration.component';
import { TenantBusinessService } from '../../../shared/services/tenant-business.service';
import { ActivatedRoute } from '@angular/router';
import { CategoriesClientService } from '../../../admin/services/categories-client.service';

@Component({
  selector: 'app-product-demonstration',
  standalone: true,
  imports: [CommonModule, DemostrationComponent],
  templateUrl: './product-demonstration.component.html',
  styleUrl: './product-demonstration.component.scss',
})
export class ProductDemonstrationComponent {
  public baseProducts: string = environments.baseProducts;

  public categories: Category[] = [];

  private categoriesClientService = inject(CategoriesClientService);
  private activatedRoute = inject(ActivatedRoute);
  private tenantBusinessService = inject(TenantBusinessService);

 

  ngOnInit(): void {
    this.categoriesClientService
      .getRecentCategories(
        this.tenantBusinessService.getBusinessName(this.activatedRoute),
        5
      )
      .subscribe((categories) => {
        this.categories = categories;
      });
  }
}
