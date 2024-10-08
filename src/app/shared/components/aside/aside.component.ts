import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { DarkmodeComponent } from '../darkmode/darkmode.component';
import { SubscriptionService } from '../../../admin/services/subscription.service';
import { TenantMe, UserMe } from '../../../auth/interfaces/me.interface';
import { Subscription } from '../../../admin/interfaces/subscription.interface';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    StyleClassModule,
    RouterModule,
    DarkmodeComponent,
  ],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideComponent implements OnInit{
 
  subscription !: Subscription

  tenant!: TenantMe;
  user!: UserMe;

  private authService = inject(AuthService);
  private subscriptionService = inject(SubscriptionService)
  
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  ngOnInit(): void {
    // Obtenemos el user autenticado y el tenant
    this.authService.me().subscribe((me) => {
      if (me.user) {
        this.tenant = me.user.tenant;
        this.user = me.user;
        this.subscriptionService.getSubscriptionById(this.tenant.id).subscribe((subs) => {
          this.subscription = subs
        
        })
      }
    });
  }

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  closeSesion() {
    this.authService.logout();
  }

  sidebarVisible: boolean = false;
}
