import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ThemeService } from '../../../shared/services/theme.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionComponent {
  @Input() color:string='black';
  private themeService = inject(ThemeService);
  get darkMode(){
    return this.themeService.signalModeDark()
  }
 }
