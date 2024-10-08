import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  inject,
} from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../../food/services/cart.service';
import { environments } from '../../../../environments/environments';
import { AmountCartComponent } from '../amount-cart/amount-cart.component';
import { CartItem } from '../../../food/interfaces/cart-item.interface';
import { ProductsService } from '../../../admin/services/products.service';
import { ProductExplorerService } from '../../../food/services/product-explorer.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { SearchAutocompleteComponent } from '../search-autocomplete/search-autocomplete.component';
import { DetailsOrderComponent } from '../details-order/details-order.component';
import { DarkmodeComponent } from '../darkmode/darkmode.component';
import { ThemeService } from '../../services/theme.service';
import { TenantBusinessService } from '../../services/tenant-business.service';
import { ProductsClientService } from '../../../admin/services/products-client.service';
import { TenantService } from '../../../admin/services/tenant.service';
import { ModalScheduleComponent } from '../modal-schedule/modal-schedule.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    SidebarModule,
    ButtonModule,
    AmountCartComponent,
    SearchAutocompleteComponent,
    DetailsOrderComponent,
    DarkmodeComponent,
    RouterModule,
    ModalScheduleComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public value: string = '';
  is768px: boolean = false;
  sidebarVisible: boolean = false;
  currentUrl!: string;

  public baseProducts: string = environments.baseProducts;
  public baseLogos : string = environments.baseLogos

  private cartService = inject(CartService);
  private productsClientService = inject(ProductsClientService); 
  private productExplorer = inject(ProductExplorerService);
  private themeService = inject(ThemeService);
  private router = inject(Router);
  private tenantBusinessService = inject(TenantBusinessService)
  private tenantService = inject(TenantService)
  urlSegments!: string[];

  public sendMessage: boolean = false;
  public amountNumber: number = 1;
  public cartId!: string;
  businessName!: string;

  get businessSignal(){
    return this.tenantBusinessService.businessSignal
  }

  get currentTenant(){
    return this.tenantService.currentTenant
  }


  constructor() {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateUrl(event.urlAfterRedirects || event.url);
      }
    });

    this.updateUrl(this.currentUrl)
    this.checkWidth();
    this.chargeInfoTenant()
  }

  //Carga a info del tenant
  private chargeInfoTenant(){
   this.tenantService.getTenantByName(this.businessSignal()).subscribe((tenant)=>{
    this.currentTenant.set(tenant)
   }) 
  }

  private updateUrl(url: string): void {
    this.currentUrl = url;

    // Divide la URL en segmentos y actualiza businessName
    this.urlSegments = this.currentUrl
      .split('/')
      .filter((segment) => segment.length > 0);

    // Aquí se asume que el nombre del negocio siempre será el último segmento de la URL
    this.businessName = this.urlSegments[this.urlSegments.length - 1];

    this.businessSignal.set(this.businessName)
  }

  cleanCart() {
    this.currentCart.set([]);
    this.cartService.saveCartStorage();
  }

  get darkMode() {
    return this.themeService.signalModeDark();
  }

  sum(cartItem: CartItem) {
    cartItem.amount++;
    this.cartService.saveCartStorage();
  }

  min(cartItem: CartItem) {
    if (cartItem.amount == 1) return;
    cartItem.amount--;
    this.cartService.saveCartStorage();
  }

  deleteCartItem(id: string) {
    const cartDeleteUpdate = this.currentCart().filter(
      (cartItem) => cartItem.id != id
    );
    this.currentCart.set(cartDeleteUpdate);
    this.cartService.saveCartStorage();
  }

  //Carrito de compras
  get currentCart() {
   // console.log(this.currentCart());
    return this.cartService.cartSignal;
  }

  //Obtener la signal de los productos explorer
  get proExSignal() {
    return this.productExplorer.proExSignal;
  }

  //Obtener la signal del subtotal
  get subTotalSignal() {
    return this.cartService.subTotalCartSignal;
  }

  get totalItemsCart() {
    const totalItems = this.currentCart().reduce(
      (accumulator, cartItem) => accumulator + cartItem.amount,
      0
    );
    return totalItems;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWidth();
  }

  getSearchItem($search: string) {
 //   console.log($search);
 //   console.log(this.businessName);

    this.productsClientService
      .getSearchItems(this.businessName, $search)
      .subscribe((products) => {
        if (products) {
          this.proExSignal.set(products);
        }
      });
  }

  getEmitDetails(event: any) {
    this.sendMessage = event;
  }

  sendMessageW() {
    this.sendMessage = true;
  }

  public checkWidth() {
    this.is768px = window.innerWidth >= 768;
  }
}
