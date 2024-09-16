import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrdersService } from '../../../food/services/orders.service';
import { Order } from '../../../food/interfaces/order.interface';
import { Subscription } from 'rxjs';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { DateformatPipe } from '../../../shared/pipes/dateformat.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { ModalShowProductsOrderComponent } from '../../components/modal-show-products-order/modal-show-products-order.component';
import { SearchComponent } from '../../../shared/components/search/search.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    RatingModule,
    ButtonModule,
    DateformatPipe,
    DropdownModule,
    ModalShowProductsOrderComponent,
    SearchComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  private ordersService = inject(OrdersService);

  orders: Order[] = [];
  orderSubscription!: Subscription;
  chargeWhitOutResult:boolean = false
 
  placeholder: string = 'Cliente';

  ngOnInit(): void {
    
    this.ordersAll();
    // this.echoService.listenToEvents();
    // this.startPolling();
  }

  formatOrdersJson(orders: Order[]) {
    this.orders = orders.map((order) => {
      if (order.cart) {
        order.cart = JSON.parse(order.cart);
      }
      return order;
    });
  }

  getSearchItem($search: string) {
    // console.log($search);
    this.ordersService.getSearchItems($search).subscribe((orders) => {
      // console.log(orders);

      this.formatOrdersJson(orders);
    });
  }

  ordersAll() {
   
    
    this.ordersService
      .getOrders()
      .subscribe((orders) => {
        if (!orders.length) {
          this.chargeWhitOutResult=true
          return
        }
        this.formatOrdersJson(orders)
      });
  }

  ordersPending() {
    this.ordersService
      .getOrdersStatus(0)
      .subscribe((orders) => this.formatOrdersJson(orders));
  }

  ordersSuccess() {
    this.ordersService
      .getOrdersStatus(1)
      .subscribe((orders) => this.formatOrdersJson(orders));
  }

  ngOnDestroy(): void {
    // this.webSocketService.unsubscribeFromChannel('orders');
    //this.stopPolling();
  }

  changeStatus(id: number) {
    this.ordersService.updateStatusOrder(id).subscribe((order) => {
      const { tel, name_client } = order;
      const message = `¡Hola! ${name_client} su orden ya fue entregada`;
      const whatsappUrl = `https://wa.me/+593${tel.replace(
        /\D/g,
        ''
      )}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      this.ordersService.getOrders().subscribe((orders) => {
        this.orders = orders.map((order) => {
          if (order.cart) {
            order.cart = JSON.parse(order.cart);
          }
          return order;
        });
      });
    });
  }
 }
