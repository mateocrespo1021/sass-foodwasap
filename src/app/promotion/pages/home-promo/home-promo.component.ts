import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlansComponent } from '../../components/plans/plans.component';

@Component({
  selector: 'app-home-promo',
  standalone: true,
  imports: [
    CommonModule,
    PlansComponent,
],
  templateUrl: './home-promo.component.html',
  styleUrl: './home-promo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePromoComponent { 

}
