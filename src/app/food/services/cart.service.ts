import { Injectable, signal } from '@angular/core';
import { CartItem } from '../interfaces/cart-item.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = signal<CartItem[]>([]);
  private subtotalCart = signal<number>(0);

  constructor() {
    this.loadFromLocalStorage();
  }

  get subTotalCartSignal() {
    return this.subtotalCart;
  }

  get cartSignal() {
    return this.cart;
  }

  saveCartStorage() {
    this.calcSubtotal()
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }

  private loadFromLocalStorage() {
    if (!localStorage.getItem('cart')) return;
    this.cart.set(JSON.parse(localStorage.getItem('cart')!));
  }

  calcSubtotal() {
    const totalAd = this.cart().reduce(
      (accumulator, cartItem) => accumulator + cartItem.totalAd,
      0
    );
    const totalV = this.cart().reduce(
      (accumalator, cartItem) =>
        accumalator + cartItem.totalCv * cartItem.amount,
      0
    );

    this.subtotalCart.set(totalAd + totalV);
  }
}
