import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Slider } from '../../interfaces/slider.interface';
import { SlidersService } from '../../services/sliders.service';
import { environments } from '../../../../environments/environments';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ModalAddSliderComponent } from '../../components/modal-add-slider/modal-add-slider.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { ModalEditSliderComponent } from '../../components/modal-edit-slider/modal-edit-slider.component';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-sliders-management',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    ModalAddSliderComponent,
    ToastModule,
    ConfirmDialogModule,
    SearchComponent,
    ModalEditSliderComponent

  ],
  templateUrl: './sliders-management.component.html',
  styleUrl: './sliders-management.component.scss',
})
export class SlidersManagementComponent implements OnInit{

  public baseSliders = environments.baseSliders
  private slidersService = inject(SlidersService)
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  
  get sliders(){
    return this.slidersService.currentSliders
  }

  ngOnInit(): void {
    this.allSliders()
  } 

  allSliders(){
    this.slidersService.getSliders().subscribe((sliders)=>{
      this.sliders.set(sliders)
    })
  }

  deleteSlider(event: Event, id: number){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Quiere eliminar este slider?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        //Eliminar la variante
        if (id) {
          this.slidersService.deleteSliderById(id).subscribe((result) => {
            if (result) {
              const slidersUpdate = this.sliders().filter((slider) => slider.id !=id)
              this.sliders.set(slidersUpdate)
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'Eliminado Correctamente',
              });
              return;
            }
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'Error al eliminar',
            });
          });
        }
      }
    });
  }

  getSearchDevounce(query: string) {
    this.slidersService.getSearchItems(query).subscribe((sliders) => {
      if (sliders.length) {
        this.sliders.set(sliders);
        return
      }
        this.allSliders()

    });
  }

  getSeverity(status: number) {
    switch (status) {
      case 0:
        return 'danger';
      case 1:
        return 'success';
      default:
        return '';
    }
  }
    
}
