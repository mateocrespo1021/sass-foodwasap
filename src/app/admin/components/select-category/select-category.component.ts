import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Category } from '../../interfaces/category.interface';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
@Component({
  selector: 'app-select-category',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule],
  templateUrl: './select-category.component.html',
  styleUrl: './select-category.component.scss',
})
export class SelectCategoryComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService);
  

  selectedCategory!: Category;

  get currentCategory() {
    return this.categoriesService.currentCategory;
  }

  get currentCategoriesSelected(){
    return this.categoriesService.currentCategoriesSelect
  }

  get currentProducts() {
    return this.productsService.currentProducts;
  }

  ngOnInit() {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.currentCategoriesSelected.set(categories);
    });
  }

  onChangeCategory() {
    if (this.selectedCategory == null) return;
    this.productsService
      .getProductsByCategory(this.selectedCategory.id)
      .subscribe((products) => {
        this.currentCategory.set(this.selectedCategory);
        this.currentProducts.set(products);
      });
  }
}
