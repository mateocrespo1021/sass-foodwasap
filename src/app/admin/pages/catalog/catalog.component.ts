import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Signal,
  inject,
  signal,
} from '@angular/core';

import { FileComponent } from '../../components/file/file.component';
import { CategoriesService } from '../../services/categories.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { ProductsComponent } from '../../components/products/products.component';
import { MenubarComponent } from '../../components/menubar/menubar.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ModalEditCategoryComponent } from '../../components/modal-edit-category/modal-edit-category.component';
import { ModalAddCategoryComponent } from '../../components/modal-add-category/modal-add-category.component';
import { ToastModule } from 'primeng/toast';
import { SelectCategoryComponent } from '../../components/select-category/select-category.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../../auth/services/auth.service';
@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    ModalEditCategoryComponent,
    FileComponent,
    ToastModule,
    ProductsComponent,
    MenubarComponent,
    LoadingComponent,
    ModalAddCategoryComponent,
    SearchComponent,
    SelectCategoryComponent,
    ConfirmDialogModule,
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService);
  charge:boolean = true

  searchDevounce: string = '';

  get category() {
    return this.categoriesService.currentCategory;
  }

  get currentProducts() {
    return this.productsService.currentProducts;
  }

  //Obtiene la signal
  get spinner() {
    return this.categoriesService.spinnerState;
  }

  getSearchDevounce(query: string) { 
    this.productsService.getSearchItems(query).subscribe((products) => {
      if (products.length) {
        this.currentProducts.set(products);
      }
    });
  }

  ngOnInit(): void {
    if (this.category().id) return;
    this.categoriesService.lastCategory().subscribe((category) => {
      
      if (category) {
        this.category.set(category);
      }

      this.charge = false
    });
  }
}
