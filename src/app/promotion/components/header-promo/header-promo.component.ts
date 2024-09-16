import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-header-promo',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './header-promo.component.html',
  styleUrl: './header-promo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderPromoComponent { }
