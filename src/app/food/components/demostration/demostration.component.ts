import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { Category } from '../../../admin/interfaces/category.interface';
import { Product } from '../../../admin/interfaces/product.interface';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { environments } from '../../../../environments/environments';
import { CarouselProductsComponent } from '../carousel-products/carousel-products.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TenantBusinessService } from '../../../shared/services/tenant-business.service';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';
import { ThemeService } from '../../../shared/services/theme.service';
import { ResponsiveService } from '../../../shared/services/responsive.service';
import { ProductsClientService } from '../../../admin/services/products-client.service';

@Component({
  selector: 'app-demostration',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    ButtonModule,
    TagModule,
    CarouselProductsComponent,
    RouterModule,
    LoadingSkeletonComponent
  ],
  templateUrl: './demostration.component.html',
  styleUrl: './demostration.component.scss',
})
export class DemostrationComponent implements OnInit {
  public baseProducts: string = environments.baseProducts;
  private activatedRoute = inject(ActivatedRoute);
  private tenantBusinessService = inject(TenantBusinessService);
  private themeService = inject(ThemeService);

  //Agreggo darkmode segun el caso para los estilos sin primeng
  get darkMode() {
    return this.themeService.signalModeDark();
  }
  businessName!: string | null;
  @Input()
  category!: Category;

  public products: Product[] = [];

  private productsClientService = inject(ProductsClientService);

  //Puntos responsivos para el esqueloto de carga carusel
  responsiveOptions: any[];

  //Injeccion del responsiveservice y uso de esponsiveoptions
  constructor(private responsiveService: ResponsiveService) {
    this.responsiveOptions = this.responsiveService.responsiveOptions;
  }

  //Numero del skeleto de carga
  getSkeletonArray(): number[] {
    return this.responsiveService.getSkeletonArray();
  }


  ngOnInit(): void {
    this.businessName = this.tenantBusinessService.getBusinessName(
      this.activatedRoute
    );
    this.productsClientService
      .getProductsByCategoryLimit(this.category.id, 10)
      .subscribe((products) => {
        this.loadingProducts = true;
        this.products = products;
      });
  }

  public loadingProducts: boolean = false;

 
}
