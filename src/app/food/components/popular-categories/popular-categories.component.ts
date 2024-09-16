import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CategoriesService } from '../../../admin/services/categories.service';
import { Category } from '../../../admin/interfaces/category.interface';
import { environments } from '../../../../environments/environments';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TenantBusinessService } from '../../../shared/services/tenant-business.service';
import { ProgressiveImageComponent } from '../../../shared/components/ProgressiveImage/ProgressiveImage.component';
import { LazyImageComponent } from '../../../shared/components/lazy-image/lazy-image.component';
import { CategoriesClientService } from '../../../admin/services/categories-client.service';

@Component({
  selector: 'app-popular-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProgressiveImageComponent,
    LazyImageComponent
  ],
  templateUrl: './popular-categories.component.html',
  styleUrl: './popular-categories.component.scss',
})
export class PopularCategoriesComponent implements OnInit{

  public baseCategories : string  = environments.baseCategories

  public categories : Category[] = []
  
  private categoriesClientService = inject(CategoriesClientService)
  private activatedRoute = inject(ActivatedRoute)
  private tenantBusinessService = inject(TenantBusinessService)
  businessName!:string | null

  ngOnInit(): void {
    this.businessName =this.tenantBusinessService.getBusinessName(this.activatedRoute) 
    this.categoriesClientService.getRecentCategories(this.businessName,12).subscribe((categories)=>{
      this.categories = categories
    })
  } 
}
 