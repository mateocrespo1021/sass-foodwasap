import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderAdminComponent } from './shared/components/header-admin/header-admin.component';
import { AuthService } from './auth/services/auth.service';
import { LayoutService } from './shared/services/layout.service';
import { HeaderPromoComponent } from './promotion/components/header-promo/header-promo.component';
import { FooterPromoComponent } from './promotion/components/footer-promo/footer-promo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SpinnerComponent,
    HeaderComponent,
    FooterComponent,
    HeaderAdminComponent,
    HeaderPromoComponent,
    FooterPromoComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {}
  loading: boolean = false;
  layoutService = inject(LayoutService);
}
