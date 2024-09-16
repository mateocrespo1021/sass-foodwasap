import { CommonModule } from '@angular/common';
import {
  Component,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { DateformatPipe } from '../../../shared/pipes/dateformat.pipe';
import { ModalShowProductsOrderComponent } from '../../components/modal-show-products-order/modal-show-products-order.component';
import { DropdownModule } from 'primeng/dropdown';
import { SearchComponent } from '../../../shared/components/search/search.component';
@Component({
  selector: 'app-dashboard',
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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent  {
        
}
