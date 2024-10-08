import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  inject,
} from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { RouterModule } from '@angular/router';
import { TenantService } from '../../../admin/services/tenant.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  date: number;
  is768px: boolean = false;
  private themeService = inject(ThemeService);
  private tenantService = inject(TenantService)

  get socialMedias(){
    if (this.currentTenant.social_networks) {
      return JSON.parse(this.currentTenant.social_networks)
    }
  }

 get currentTenant(){
  return this.tenantService.currentTenant()
 }

  constructor() {
    this.date = new Date().getFullYear();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWidth();
  }
  get darkMode(){
    return this.themeService.signalModeDark()
  }

  public checkWidth() {
    this.is768px = window.innerWidth >= 768;
  }

  ngOnInit(): void {
    
    this.checkWidth();
  }
}
