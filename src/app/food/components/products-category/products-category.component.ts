import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { DropdownModule } from 'primeng/dropdown';
import { Tag, TagModule } from 'primeng/tag';
import { SelectItem } from 'primeng/api';
import { Product } from '../../../admin/interfaces/product.interface';
import { ProductsService } from '../../../admin/services/products.service';
import { ProductExplorerService } from '../../services/product-explorer.service';
import { environments } from '../../../../environments/environments';
import { FormsModule } from '@angular/forms';
import { ModalProductService } from '../../services/modal-product.service';
import { CartService } from '../../services/cart.service';
import { LazyImageComponent } from '../../../shared/components/lazy-image/lazy-image.component';
@Component({
  selector: 'app-products-category',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    ButtonModule,
    TagModule,
    RatingModule,
    DropdownModule,
    FormsModule,
    LazyImageComponent
  ],
  templateUrl: './products-category.component.html',
  styleUrl: './products-category.component.scss',
})
export class ProductsCategoryComponent {
  private productExplorer = inject(ProductExplorerService);
  private modalProduct = inject(ModalProductService);
  private productsService = inject(ProductsService);
  private cartsService = inject(CartService);

  public baseProducts = environments.baseProducts;
  sortOptions!: SelectItem[];

  sortOrder!: number;

  sortField!: string;

  get currentCart() {
    return this.cartsService.cartSignal;
  }

  get products() {
    return this.productExplorer.proExSignal;
  }

  get currentProduct() {
    return this.modalProduct.productSignal;
  }

  get modal() {
    return this.modalProduct.modalSignal;
  }

  ngOnInit() {
    this.sortOptions = [
      { label: 'Precio alto a bajo', value: '!price' },
      { label: 'Precio bajo a alto', value: 'price' },
    ];
  }

  showModal(id: number) {
    this.productsService.getProductsById(id + '').subscribe((product) => {
      this.currentProduct.set(product!);
      this.modal.set(true);
    });
  }

  amountProduct(id: number) {
    const amountProduct = this.currentCart().reduce((accumulator, cartItem) => {
      if (cartItem.product.id === id) {
        return accumulator + cartItem.amount;
      } else {
        return accumulator;
      }
    }, 0);

    if (amountProduct) {
      return amountProduct.toString();
    }

    return '';
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  counterArray(n: number): any[] {
    return Array(n);
  }

  // getSeverity(product: Product) {
  //     switch (product.inventoryStatus) {
  //         case 'INSTOCK':
  //             return 'success';

  //         case 'LOWSTOCK':
  //             return 'warning';

  //         case 'OUTOFSTOCK':
  //             return 'danger';

  //         default:
  //             return null;
  //     }
  // };
}
