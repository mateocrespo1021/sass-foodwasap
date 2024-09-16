import { Injectable, signal } from '@angular/core';
import { Product } from '../../admin/interfaces/product.interface';
import { CartItem } from '../interfaces/cart-item.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalProductService {

  //Estado del modal
  private modal = signal<boolean>(false)
  //Producto que se muestra en el modal
  private product = signal<Product>({} as Product)
  //CartItem para editar en el modal con su info - por ahora no
  // private cartItemEdit = signal<CartItem>({} as CartItem)

  get modalSignal(){
    return this.modal
  }

  get productSignal(){
    return this.product
  }

  // get cartItemEditSignal(){
  //   return this.cartItemEdit
  // }
  constructor() { }

}
