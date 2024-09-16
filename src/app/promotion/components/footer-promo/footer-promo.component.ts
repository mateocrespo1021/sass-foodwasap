import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer-promo',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './footer-promo.component.html',
  styleUrl: './footer-promo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterPromoComponent { }
