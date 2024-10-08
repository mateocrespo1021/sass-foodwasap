import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ModalProductService } from '../../services/modal-product.service';
import { environments } from '../../../../environments/environments';
import { ImageModule } from 'primeng/image';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { VariantsService } from '../../../admin/services/variants.service';
import { AdditionalsService } from '../../../admin/services/additionals.service';
import { Variant } from '../../../admin/interfaces/variant.interface';
import { Additional } from '../../../admin/interfaces/additional.interface';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';
import { AccordionModule } from 'primeng/accordion';
import { CartService } from '../../services/cart.service';
import { v4 as uuidv4 } from 'uuid';
import { CartItem } from '../../interfaces/cart-item.interface';
import { AmountCartComponent } from '../../../shared/components/amount-cart/amount-cart.component';
import { AmountAdditionalComponent } from '../amount-additional/amount-additional.component';
import { HelpersService } from '../../../shared/services/helpers.service';
import { TenantBusinessService } from '../../../shared/services/tenant-business.service';
import { TenantService } from '../../../admin/services/tenant.service';

@Component({
  selector: 'app-modal-cart-product',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    ImageModule,
    ReactiveFormsModule,
    RadioButtonModule,
    CheckboxModule,
    FormsModule,
    KnobModule,
    AmountAdditionalComponent,
    AccordionModule,
    AmountCartComponent,
  ],
  templateUrl: './modal-cart-product.component.html',
  styleUrl: './modal-cart-product.component.scss',
})
export class ModalCartProductComponent implements OnInit , AfterViewInit {
 
  private modalProduct = inject(ModalProductService);
  private variantsService = inject(VariantsService);
  private additionalsService = inject(AdditionalsService);
  private cartService = inject(CartService);
  private messageService = inject(MessageService);
  private helpersService = inject(HelpersService)
  private tenantService = inject(TenantService)
  public cost = signal<number>(0);
  public costVariant = signal<number>(0);
  public costAdditional = signal<number>(0);
  valueAmount: number = 1;
  public baseProducts = environments.baseProducts;
  public isOpen = false;

  is768px: boolean = false;

  //Data que se muestra
  public variants!: Variant[] | undefined;
  public additionals!: Additional[] | undefined;

  //Seleccionados
  public checkAdditionals: Additional[] = [];
  public selectedVariant: Variant | null = null;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWidth();
  }

  calcPriceFinal(price:number,iva:number):string{
    return this.helpersService.calcPriceFinal(price,iva).toFixed(2)
  }

  get currentTenant(){
    return this.tenantService.currentTenant()
  }

  public checkWidth() {
    this.is768px = window.innerWidth <= 768;
  }

  //Signal para el modal
  get visible() {
    return this.modalProduct.modalSignal;
  }

  get totalCost(): number {
    return (
      (this.cost() + this.costVariant()) * this.valueAmount +
      this.costAdditional()
    );
  }

  //Producto actual en el modal
  get currentProduct() {
    return this.modalProduct.productSignal;
  }

  //El carrito de compras signal
  get currentCart() {
    return this.cartService.cartSignal;
  }

  ngOnInit() {
    
    
    this.checkWidth();
    this.cost.set(this.currentProduct().price);
    this.variantsService
      .getVariantsByProduct(this.currentProduct().id + '')
      .subscribe((variants) => {
        if (variants) {
          this.variants = variants;
        }
      });

    this.additionalsService
      .getAdditionalsByProduct(this.currentProduct().id + '')
      .subscribe((addtionals) => {
        this.additionals = addtionals;
      });
  }

  ngAfterViewInit(): void {
    //Verifico si ya esta cerrado el negocio
    this.isOpen = this.helpersService.isBusinessOpen(JSON.parse(this.currentTenant.schedule))
    console.log(this.isOpen);
    
  }

  //Suma y min de cantidad de producto
  sum() {
    this.valueAmount++;
  }

  min() {
    if (this.valueAmount == 1) return;
    this.valueAmount--;
  }

  amountAdditional(additional: Additional) {
    const exist = this.checkAdditionals.some(
      (addi) => addi.id == additional.id
    );

    if (!exist) {
      this.checkAdditionals.push(additional);
    } else {
      if (!additional.amount) {
        this.checkAdditionals = this.checkAdditionals.filter(
          (addi) => addi.id != additional.id
        );
      } else {
        this.checkAdditionals = this.checkAdditionals.map((addi) => {
          if (addi.id == additional.id) {
            addi.amount = additional.amount;
            return addi;
          }

          return addi;
        });
      }
    }

    //Sumamos los adicionales
    this.sumTotalAditionals();
  }

  sumTotalAditionals() {
    this.costAdditional.set(
      this.checkAdditionals.reduce((accumulator, item) => {
        if (!item.amount) item.amount = 1;
        return accumulator + item.price * item.amount;
      }, 0)
    );
  }

  //El item que tengo que agregar al carrito - currentCar
  get currentCartItem() {
    const totalCv = this.cost() + this.costVariant();
    if (!this.selectedVariant) {
      this.selectedVariant = { id: 0 } as Variant;
    }
    const cartItem = {
      id: uuidv4(),
      product: this.currentProduct(),
      variant: this.selectedVariant,
      additionals: this.checkAdditionals,
      totalAd: this.costAdditional(),
      totalCv: totalCv,
      amount: this.valueAmount,
    } as CartItem;
    return cartItem;
  }

  //Agrega el cartItem al carrito cart
  addCart() {
    //console.log(this.currentCartItem);

    const existItem = this.currentCart().some(
      (cartItem) => cartItem.product.id === this.currentCartItem.product.id
    );

    //Verificar si es repetido
    if (existItem) {
      let verifiedUpdate = false;
      const cartUpdate = this.currentCart().map((cartItem) => {
        //El que quiero agregar
        const currentItem = this.extractAndSortIds(
          this.currentCartItem.additionals
        );
        //Se encuentra en el carrito ya
        const oldItem = this.extractAndSortIds(cartItem.additionals);

        let equalsAddi = false;

        equalsAddi = currentItem.every((id, index) => id === oldItem[index]);
        //Verfico si tiene el mismo producto , variante y adicionales
        if (
          cartItem.product.id === this.currentCartItem.product.id &&
          cartItem.variant.id === this.currentCartItem.variant.id &&
          equalsAddi
        ) {
          verifiedUpdate = true;
          // Actualizo la cantidad del cartItem
          cartItem.amount += this.currentCartItem.amount;

          //Actualizamos el amount de cada adicional
          cartItem.additionals.map((addi, index) => {
            if (addi.id == this.currentCartItem.additionals[index].id) {
              addi.amount += this.currentCartItem.additionals[index].amount;
            }
            return cartItem;
          });
         //Actualizamos el total de adicionales
          cartItem.totalAd= cartItem.additionals.reduce((accumulator, item) => {
            if (!item.amount) item.amount = 1;
            return accumulator + item.price * item.amount;
          }, 0) 
        }
        return cartItem;
      });

      if (verifiedUpdate) {
        this.currentCart.set(cartUpdate);
        this.cartService.saveCartStorage();
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Agregado Correctamente',
        });
        this.visible.set(false);
        return;
      }
    }

    this.currentCart.set([this.currentCartItem, ...this.currentCart()]);
    this.cartService.saveCartStorage();

    this.messageService.add({
      severity: 'info',
      summary: 'Confirmed',
      detail: 'Agregado Correctamente',
    });
    this.visible.set(false);
  }

  extractAndSortIds(arr: Additional[]): number[] {
    return arr.map((item) => item.id).sort((a, b) => a - b);
  }

  changeVariants() {
    // console.log(this.selectedVariant);
    if (this.selectedVariant) {
      this.costVariant.set(this.selectedVariant.price);
      return;
    }
    this.costVariant.set(0);
  }
}
