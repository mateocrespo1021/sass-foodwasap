import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { DarkmodeComponent } from '../darkmode/darkmode.component';
@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [
    CommonModule,
    SidebarModule, ButtonModule, RippleModule, AvatarModule, StyleClassModule,RouterModule,DarkmodeComponent
  ],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideComponent { 
  private authService = inject(AuthService)
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  closeCallback(e:any): void {
      this.sidebarRef.close(e);
  }

  closeSesion(){
this.authService.logout()
  }

  sidebarVisible: boolean = false;
}
