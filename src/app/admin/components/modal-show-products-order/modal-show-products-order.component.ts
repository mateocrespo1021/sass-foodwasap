import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CartItem } from '../../../food/interfaces/cart-item.interface';
import { environments } from '../../../../environments/environments';
@Component({
  selector: 'app-modal-show-products-order',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TableModule],
  templateUrl: './modal-show-products-order.component.html',
  styleUrl: './modal-show-products-order.component.scss',
})
export class ModalShowProductsOrderComponent {

  @Input()
  cart : CartItem[] = []

  public baseProducts: string = environments.baseProducts;

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
}
