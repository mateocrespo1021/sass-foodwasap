import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AsideComponent } from '../aside/aside.component';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { DarkmodeComponent } from '../darkmode/darkmode.component';


@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [
    CommonModule,
    AsideComponent,
    MenuAdminComponent,
    DarkmodeComponent
  ],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderAdminComponent { 
  
}
