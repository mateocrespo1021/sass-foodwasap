import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GeolocationService } from '../../../food/services/geolocation.service';
import { CartService } from '../../../food/services/cart.service';
import { MessageService } from 'primeng/api';
import { CartItem } from '../../../food/interfaces/cart-item.interface';
import { InputMaskModule } from 'primeng/inputmask';
import { OrdersService } from '../../../food/services/orders.service';
import { Order } from '../../../food/interfaces/order.interface';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TenantBusinessService } from '../../services/tenant-business.service';

@Component({
  selector: 'app-details-order',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    InputTextareaModule,
    ButtonModule,
    InputMaskModule
  ],
  templateUrl: './details-order.component.html',
  styleUrl: './details-order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsOrderComponent{
  
  private fb = inject(FormBuilder);
  private geolocationService = inject(GeolocationService);
  private cartService = inject(CartService);
  private messageService = inject(MessageService);
  private ordersService = inject(OrdersService)
  private activatedRoute = inject(ActivatedRoute)
  private tenantBusinessService = inject(TenantBusinessService)

  get businessSignal(){
    return this.tenantBusinessService.businessSignal
  }


  @Output()
   hiddenDetails = new EventEmitter<boolean>()

  emitEvent() {
    this.hiddenDetails.emit(false);
  }

  public direction = signal<string>('');
  typesDelevery: any[] = [
    { name: 'Domicilio', key: 'D' },
    { name: 'Retiro', key: 'R' },
  ];

  typesPay: any[] = [
    { name: 'Efectivo', key: 'E' },
    { name: 'Transferencia', key: 'T' },
  ];

  public formDetails: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    delivery: ['', [Validators.required]],
    pay: ['', Validators.required],
    direction: ['', Validators.required],
    note: [''],
    tel:['' , Validators.required]
  });

  get currentCart() {
    return this.cartService.cartSignal;
  }

  get subtotal() {
    return this.cartService.subTotalCartSignal;
  }

  getPosition() {
    this.geolocationService.getCurrentPosition().subscribe((resp) => {
      const { latitude, longitude } = resp.coords;
      if (latitude && longitude) {
        this.geolocationService
          .getAddress(latitude, longitude)
          .subscribe((resp) => {
            this.formDetails.patchValue({
              direction: { lat: latitude, lon: longitude, name: resp },
            });
            this.direction.set(resp);
          });
      }
    });
  }

  get orderForm(){
    const {name , delivery, pay , direction , note ,tel} = this.formDetails.value
    //Verrficacion Note
    const noteVerfied = note == '' ? 'Ninguna' : note
    const order = {
      name_client : name,
      delivery : delivery.name ,
      pay : pay.name,
      direction : direction.name,
      note: noteVerfied,
      tel,
      cart : JSON.stringify(this.currentCart()),
      price_total : this.subtotal(), 
      business_name : this.businessSignal()
    } as Order

    return order
  }

 

  sendMessage() {
    if (!this.formDetails.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Fata datos',
        detail: 'Ingrese todos los datos',
      });

      return;
    }

    //Obteener el id_tenant por el nombree del negocio en la url



    //Enviamos el mensaje por wasap , guardamos la orden y llamamos websocket

    this.ordersService.addOrder(this.orderForm).subscribe((order)=>{
      if (order) {
        this.currentCart.set([])
        this.subtotal.set(0)
        //this.hiddenDetails.emit(false);
        this.cartService.saveCartStorage()
        //this.router.navigateByUrl("/")
        window.location.reload()
        this.messageService.add({
          severity: 'info',
          summary: 'Pedido realizado con exito',
          
        });
      }
    })

    const googleMapsLink = `https://www.google.com/maps?q=${
      this.formDetails.get('direction')!.value.lat
    },${this.formDetails.get('direction')!.value.lon}`;

    const message = encodeURIComponent(
      '¡Hola! 🌟 Estoy interesado en encargar:\n\n' +
        this.formatCartItems(this.currentCart()) +
        `\n\n------------------------------------>\nNota : ${this.formDetails.get('note')!.value} ` +
        `\n\n------------------------------------>\nUbicación : ${this.formDetails.get('direction')!.value.name}` +
        `\n\n------------------------------------>\nGoogle Maps :${googleMapsLink}`
    );

    const whatsappUrl = `https://wa.me/+593983513154?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }

  formatCartItems(cartItems: CartItem[]): string {
    return (
      cartItems
        .map((item) => {
          const additionals = item.additionals.length
            ? item.additionals
                .map(
                  (add) =>
                    `${add.name + 'x' + add.amount + ' '} ($${add.price.toFixed(
                      2
                    )})`
                )
                .join(', ')
            : 'Ninguno';
          return `*${
            item.product.name +
            (item.variant.id != 0 ? ' Variante ' + item.variant.name : '')
          }*\nCantidad: ${
            item.amount
          } \n\nAdicionales: ${additionals}\n\n💵 Precio: $${(
            item.totalCv * item.amount +
            item.totalAd
          ).toFixed(2)}\n\n------------------------------------>\n`;
        })
        .join('\n') +
      `\n🚚 Tipo de entrega :  ${
        this.formDetails.get('delivery')!.value.name
      }\n💳 Tipo de pago :  ${
        this.formDetails.get('pay')!.value.name
      }\n\n------------------------------------>\n\n*Total: $` +
      this.subtotal() +
      '*'
    );
  }
}
