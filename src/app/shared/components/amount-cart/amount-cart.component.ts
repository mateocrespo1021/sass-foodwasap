import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../food/interfaces/cart-item.interface';
import { CartService } from '../../../food/services/cart.service';

@Component({
  selector: 'app-amount-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

  ],
  templateUrl: './amount-cart.component.html',
  styleUrl: './amount-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountCartComponent implements OnInit{

  private cartService = inject(CartService)

  get currentCart(){
    return this.cartService.cartSignal
  }
 
  @Input() cartItem!:CartItem
  @Output() numberAmount = new EventEmitter<{id:string , amount:number}>();
  valueAmount : number = 1


  ngOnInit(): void {
   const cartItemSignal = this.currentCart().find((cartItem)=> cartItem.id == this.cartItem.id) 
   this.valueAmount = cartItemSignal!.amount
  }  

  sum(){
    this.valueAmount++
    this.numberAmount.emit({id:this.cartItem.id,amount:this.valueAmount})
  }

  min(){
   if (this.valueAmount == 1) return
   this.valueAmount--
   this.numberAmount.emit({id:this.cartItem.id,amount:this.valueAmount})
  }
}
