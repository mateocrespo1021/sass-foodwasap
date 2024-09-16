import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { VariantsService } from '../../services/variants.service';
import { Variant } from '../../interfaces/variant.interface';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ModalVariantsComponent } from '../modal-variants/modal-variants.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-variants',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ModalVariantsComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './variants.component.html',
  styleUrl: './variants.component.css',
})
export class VariantsComponent implements OnInit, AfterViewInit {
  @Input()
  id_product!: string;

  get variants(){
   return this.variantsService.currentVariants
  }

  private variantsService = inject(VariantsService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.variantsService
      .getVariantsByProduct(this.id_product)
      .subscribe((variants) => {
        this.variants.set(variants!)
      });
  }



  confirm(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Quiere eliminar esta variante?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        //Eliminar la variante
        if (id) {
          this.variantsService.deleteVariantById(id).subscribe((result) => {
            if (result) {
              const variantsUpdate = this.variants().filter((variant) => variant.id !=id)
              this.variants.set(variantsUpdate)
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
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'No confirmado',
        });
      },
    });
  }
}
