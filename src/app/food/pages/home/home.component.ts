import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { PromotionComponent } from '../../components/promotion/promotion.component';
import { CarouselModule } from 'primeng/carousel';
import { RecentProductsComponent } from '../../components/recent-products/recent-products.component';
import { PopularCategoriesComponent } from '../../components/popular-categories/popular-categories.component';
import { ProductDemonstrationComponent } from '../../components/product-demonstration/product-demonstration.component';
import { ToastModule } from 'primeng/toast';
import { ModalProductService } from '../../services/modal-product.service';
import { ModalCartProductComponent } from '../../components/modal-cart-product/modal-cart-product.component';
import { ThemeService } from '../../../shared/services/theme.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    PromotionComponent,
    CarouselModule,
    RecentProductsComponent,
    PopularCategoriesComponent,
    ProductDemonstrationComponent,
    ModalCartProductComponent,
    ToastModule,
    RouterModule,
    GalleryComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

  private modalProduct = inject(ModalProductService);
  private themeService = inject(ThemeService);
  private activatedRoute = inject(ActivatedRoute)

  businessName!: string | null;
  color: string = 'red';
  secondColor : string = '#ffc107'

  get darkMode(){
    return this.themeService.signalModeDark()
  }
  get modal() {
    return this.modalProduct.modalSignal;
  }

  ngOnInit(): void {
     // Capturar el parámetro 'businessName' desde la ruta
     this.businessName = this.activatedRoute.snapshot.paramMap.get('businessName');
    // console.log(this.businessName); // Puedes eliminar esto después de verificar que funciona
  }
}
