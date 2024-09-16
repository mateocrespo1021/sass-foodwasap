import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { environments } from '../../../../environments/environments';
import { Product } from '../../../admin/interfaces/product.interface';
import { ModalCartProductComponent } from '../modal-cart-product/modal-cart-product.component';
import { ModalProductService } from '../../services/modal-product.service';
import { TagModule } from 'primeng/tag';
import { ProductsService } from '../../../admin/services/products.service';
import { CartService } from '../../services/cart.service';
import { HelpersService } from '../../../shared/services/helpers.service';
import { ProgressiveImageComponent } from '../../../shared/components/ProgressiveImage/ProgressiveImage.component';
import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';
import { LazyImageComponent } from '../../../shared/components/lazy-image/lazy-image.component';

@Component({
  selector: 'app-carousel-products',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    ButtonModule,
    TagModule,
    ModalCartProductComponent,
    ProgressiveImageComponent,
    LoadingSkeletonComponent,
    LazyImageComponent
  ],
  templateUrl: './carousel-products.component.html',
  styleUrl: './carousel-products.component.scss',
})
export class CarouselProductsComponent  {
 
  //Inyeccion de dependencias 
  private modalProduct = inject(ModalProductService);
  private cartsService = inject(CartService);

  //Uso de signals globales
  get currentCart() {
    return this.cartsService.cartSignal;
  }

  get currentProduct() {
    return this.modalProduct.productSignal;
  }

  get stateModal() {
    return this.modalProduct.modalSignal();
  }

  get modal() {
    return this.modalProduct.modalSignal;
  }

  public baseProducts: string = environments.baseProducts;


  @Input()
  public products: Product[] = [];


  responsiveOptions: any[] = [
    {
      breakpoint: '1199px',
      numVisible: 4,
      numScroll: 4,
    },
    {
      breakpoint: '991px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '800px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '600px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  

  showModal(product:Product) {
    this.currentProduct.set(product)
    this.modal.set(true)
    // this.productsService.getProductsById(id + '').subscribe((product) => {
    //   this.currentProduct.set(product!);
    //   this.modal.set(true);
    // });
  }

  
  //Calcula el total del carrito
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
}
