import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-aside-login',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './aside-login.component.html',
  styleUrl: './aside-login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideLoginComponent {
  
 }
