import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './loading-skeleton.component.html',
  styleUrl: './loading-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSkeletonComponent {
  private themeService = inject(ThemeService);

  get darkMode() {
    return this.themeService.signalModeDark();
  }
 }
