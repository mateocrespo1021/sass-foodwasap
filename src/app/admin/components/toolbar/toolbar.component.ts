import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { Category } from '../../interfaces/category.interface';
import { environments } from '../../../../environments/environments';
import { CategoriesService } from '../../services/categories.service';
import { ToastrService } from 'ngx-toastr';
import { ModalProductComponent } from '../modal-product/modal-product.component';
import { ModalEditCategoryComponent } from '../modal-edit-category/modal-edit-category.component';
import { error } from 'console';
import { ProductsService } from '../../services/products.service';
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    InputTextModule,
    ModalEditCategoryComponent,
    ModalProductComponent,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent implements OnInit {
  public baseCategories: string = environments.baseCategories;
  items: MenuItem[] | undefined;
  private confirmationService = inject(ConfirmationService);
  private categoriesService = inject(CategoriesService);
  private toastr = inject(ToastrService);
  private productsService = inject(ProductsService);
  private messageService = inject(MessageService);
  get spinner() {
    return this.categoriesService.spinnerState;
  }

  get category() {
    return this.categoriesService.currentCategory;
  }

  get currentSelectedCategories() {
    return this.categoriesService.currentCategoriesSelect;
  }

  get products() {
    return this.productsService.currentProducts;
  }

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Estás seguro de eliminar esta categoria?',
      header: 'Confirme',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.deleteCategory()
      },
      reject: () => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: ''
        // });
      },
    });
  }

  deleteCategory() {
    this.spinner.set(true);
    this.categoriesService
      .deleteCategoryById(this.category().id)
      .subscribe((resp) => {
        this.spinner.set(false);
        if (resp) {
          this.messageService.add({
            severity: 'info',
            summary: 'Categoria Eliminada Correctamente',
          });
          this.categoriesService.lastCategory().subscribe((category) => {
            if (category) {
              this.category.set(category);
              this.productsService
                .getProductsByCategory(category.id)
                .subscribe((products) => this.products.set(products));
              this.categoriesService.getCategories().subscribe((categories) => {
                this.currentSelectedCategories.set(categories);
              });
              return;
            }
            this.category.set({} as Category);
          });
        }
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Intentelo otra vez porfavor',
        // });
      });
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
      },
    ];
  }
}
