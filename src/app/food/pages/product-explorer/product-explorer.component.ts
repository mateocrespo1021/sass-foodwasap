import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import { Category } from '../../../admin/interfaces/category.interface';
import { environments } from '../../../../environments/environments';
import { ProductExplorerService } from '../../services/product-explorer.service';
import { ProductsCategoryComponent } from '../../components/products-category/products-category.component';
import { ModalProductService } from '../../services/modal-product.service';
import { ModalCartProductComponent } from '../../components/modal-cart-product/modal-cart-product.component';
import { ToastModule } from 'primeng/toast';
import { ThemeService } from '../../../shared/services/theme.service';
import { ActivatedRoute } from '@angular/router';
import { TenantBusinessService } from '../../../shared/services/tenant-business.service';
import { SkeletonDataviewComponent } from '../../../shared/components/skeleton-dataview/skeleton-dataview.component';
import { LazyImageComponent } from '../../../shared/components/lazy-image/lazy-image.component';
import { CategoriesClientService } from '../../../admin/services/categories-client.service';
import { ProductsClientService } from '../../../admin/services/products-client.service';

@Component({
  selector: 'app-product-explorer',
  standalone: true,
  imports: [
    CommonModule,
    ProductsCategoryComponent,
    ModalCartProductComponent,
    ToastModule,
    SkeletonDataviewComponent,
    LazyImageComponent
  ],
  templateUrl: './product-explorer.component.html',
  styleUrl: './product-explorer.component.scss',
})
export class ProductExplorerComponent implements OnInit {
  private categoriesClientService = inject(CategoriesClientService);
  private productsClientService = inject(ProductsClientService);
  private productExplorer = inject(ProductExplorerService);
  private modalProduct = inject(ModalProductService);
  private themeService = inject(ThemeService);
  private activatedRoute = inject(ActivatedRoute)
  private tenantBusinessService = inject(TenantBusinessService)

  public baseCategories = environments.baseCategories;

  public categories: Category[] = [];

  selectedIndex: number | null = null;
  public loadingProducts:boolean=false
  get darkMode(){
    return this.themeService.signalModeDark()
  }

  toggleClass(index: number) {
    this.selectedIndex = index; // Selecciona el nuevo índice
  }

  get proExSignal() {
    return this.productExplorer.proExSignal;
  }

  get modal() {
    return this.modalProduct.modalSignal;
  }

  ngOnInit(): void {
    this.categoriesClientService.getCategoriesClient(this.tenantBusinessService.getBusinessName(this.activatedRoute)).subscribe((categories) => {
      this.categories = categories;

      if (categories.length) {
        this.productsClientService
          .getProductsByCategory(categories[0].id)
          .subscribe((products) => {
            this.loadingProducts=true
            this.selectedIndex = 0;
            this.proExSignal.set(products);
          });
      }
    });
  }

  clickCategory(category: Category, index: number) {
    this.toggleClass(index);
    this.productsClientService
      .getProductsByCategory(category.id)
      .subscribe((products) => {
        this.proExSignal.set(products);
      });
  }
}
