import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { environments } from '../../../../environments/environments';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { CategoriesService } from '../../services/categories.service';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    RatingModule,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  public baseProducts: string = environments.baseProducts;
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private authService = inject(AuthService)
  constructor(
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef,
    private categoriesService: CategoriesService
  ) {}

  get loading(){
    return this.productsService.loading
  }

  get products() {
    return this.productsService.currentProducts;
  }

  get category() {
    return this.categoriesService.currentCategory;
  }

  get categoriesSelected() {
    return this.categoriesService.currentCategoriesSelect;
  }

  getNameCategory(id: number): string {
    const category = this.categoriesSelected().find(
      (category) => category.id == id
    );
    return category!.name;
  }

  deleteProduct(id: string) {
    this.productsService.deleteProductById(id).subscribe((resp) => {
      if (resp) {
        const productsUpdate = this.products().filter(
          (product) => product.id + '' != id
        );
        this.products.set(productsUpdate);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmación',
          detail: 'Eliminado Correctamente',
        });
        return;
      }
      this.messageService.add({
        severity: 'error',
        summary: 'Alerta',
        detail: 'Intentelo de nuevo',
      });
    });
  }

  ngOnInit(): void {
    this.loading.set(true);

    this.productsService
      .getProductsByCategory(this.category().id)
      .subscribe((products) => {
        this.products.set(products);
        this.loading.set(false)
        //console.log(products);
      });
  }

  getSeverity(status: number) {
    switch (status) {
      case 0:
        return 'danger';
      case 1:
        return 'success';
      default:
        return '';
    }
  }

  confirmDelete(event: Event,id:string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Estás seguro de eliminar este producto?',
      header: 'Confirme',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.deleteProduct(id)
      },
      reject: () => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: ''
        // });
      },
    });
  }
}
