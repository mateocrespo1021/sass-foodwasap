import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ProductsService } from '../../../admin/services/products.service';
import { environments } from '../../../../environments/environments';
import { ModalProductService } from '../../../food/services/modal-product.service';
import { TenantBusinessService } from '../../services/tenant-business.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-autocomplete',
  standalone: true,
  imports: [CommonModule, AutoCompleteModule, FormsModule],
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.scss',
})
export class SearchAutocompleteComponent implements OnInit{
  
  private productsService = inject(ProductsService);
  private modalProduct = inject(ModalProductService);
  public baseProducts = environments.baseProducts;
  public is768px : boolean = false
  items: any[] | undefined;
  private tenantBusinessService = inject(TenantBusinessService)
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router);
  selectedItem: any;
  businessName!:string
  currentUrl!: string;


  constructor() {
    this.currentUrl = this.router.url;
  }

  filteredProducts!: any[];
  ngOnInit(): void {
   this.checkWidth()
     // Divide la URL en segmentos
     const urlSegments = this.currentUrl
     .split('/')
     .filter((segment) => segment.length > 0);

   // Aquí se asume que el nombre del negocio siempre será el último segmento de la URL
   this.businessName= urlSegments[urlSegments.length - 1];

   
  }
  search(event: AutoCompleteCompleteEvent) {
    this.productsService.getSearchItems(this.businessName,event.query).subscribe((products) => {
      this.filteredProducts = products;
      // this.suggestions = [...Array(10).keys()].map(item => event.query + '-' + item);
    });
  }

  public checkWidth() {
    this.is768px = window.innerWidth >= 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWidth();
  }

  get modal() {
    return this.modalProduct.modalSignal;
  }

  get currentProduct() {
    return this.modalProduct.productSignal;
  }

  showModal(id: number) {
    this.productsService.getProductsById(id + '').subscribe((product) => {
      this.currentProduct.set(product!);
      this.modal.set(true);
    });
  }
}
