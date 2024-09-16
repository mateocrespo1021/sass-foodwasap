import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { AdditionalsService } from '../../services/additionals.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ModalAdditionalsComponent } from '../modal-additionals/modal-additionals.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-additionals',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ModalAdditionalsComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './additionals.component.html',
  styleUrl: './additionals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalsComponent implements OnInit{
  @Input()
  id_product!: string;

  get additionals(){
   return this.additionalsService.currentAdditionals
  }

  private additionalsService = inject(AdditionalsService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.additionalsService
      .getAdditionalsByProduct(this.id_product)
      .subscribe((additionals) => {
        this.additionals.set(additionals!)
      });
  }



  confirm(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Quiere eliminar este extra?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        //Eliminar la variante
        if (id) {
          this.additionalsService.deleteAdditionalById(id).subscribe((result) => {
            if (result) {
              const additionalsUpdate = this.additionals().filter((additional) => additional.id !=id)
              this.additionals.set(additionalsUpdate)
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
