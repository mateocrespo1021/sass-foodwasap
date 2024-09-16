import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { SlidersService } from '../../../admin/services/sliders.service';
import { TenantBusinessService } from '../../services/tenant-business.service';
import { ActivatedRoute } from '@angular/router';
import { Slider } from '../../../admin/interfaces/slider.interface';
import { FormsModule } from '@angular/forms';
import { environments } from '../../../../environments/environments';
import { ButtonModule } from 'primeng/button';
import { LazyImageComponent } from '../lazy-image/lazy-image.component';
import { ThemeService } from '../../services/theme.service';
import { SlidersClientService } from '../../../admin/services/sliders-client.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, GalleriaModule,FormsModule,ButtonModule,LazyImageComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  sliders:Slider[] = []
  images: any[] | undefined;
  private tenantBusinessService = inject(TenantBusinessService);
  private activatedRoute = inject(ActivatedRoute);
  public baseSliders = environments.baseSliders
  loading: boolean = true; // Agregado para manejar el estado de carga

  private themeService = inject(ThemeService);

  get darkMode() {
    return this.themeService.signalModeDark();
  }

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  constructor(private slidersClientService: SlidersClientService) {}

  ngOnInit() {
   // console.log("Hola desde galeria");
    
    this.slidersClientService.getSlidersClient(
      this.tenantBusinessService.getBusinessName(this.activatedRoute)
    ).subscribe(
      (sliders) => {
        // Maneja los valores emitidos (next)
        this.sliders = sliders;
        this.loading = false;
      },
      (error) => {
        // Maneja los errores (error)
        console.error('Error al cargar los sliders:', error);
        this.loading = false;
      },
    )
  }

  imageLoaded: boolean = false;

onImageLoad(event: Event) {
  this.imageLoaded = true;
}

}