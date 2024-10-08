import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-aside-register',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './aside-register.component.html',
  styleUrl: './aside-register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideRegisterComponent { 
  
}
