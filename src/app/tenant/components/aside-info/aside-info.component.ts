import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-aside-info',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './aside-info.component.html',
  styleUrl: './aside-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideInfoComponent { }
