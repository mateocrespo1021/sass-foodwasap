import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdditionalsService } from '../../services/additionals.service';
import { Additional } from '../../interfaces/additional.interface';
@Component({
  selector: 'app-modal-additionals',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  templateUrl: './modal-additionals.component.html',
  styleUrl: './modal-additionals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ModalAdditionalsComponent { 
  @Input()
  idProduct!: string;
  //Para el modo editar
  @Input()
  idAdditional!: string;

  visible: boolean = false;
  public formAdditional!: FormGroup;

  get additionals() {
    return this.additionalsService.currentAdditionals;
  }

  private fb = inject(FormBuilder);
  private additionalsService = inject(AdditionalsService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    //console.log('hola', this.idVariant);

    this.formAdditional = this.fb.group({
      name: [
        '',
        this.idAdditional ? [Validators.minLength(3)] :[ Validators.required, Validators.minLength(3)] ,
      ],
      price: ['', this.idAdditional ? [] :[Validators.required]],
      id_product: [this.idProduct],
    });

    if (this.idAdditional) {
      this.additionalsService
        .getAdditionalById(this.idAdditional)
        .subscribe((additional) => {
          this.formAdditional.patchValue({
            name: additional?.name,
            price: additional?.price,
            id_product: additional?.id_product,
          });
        });
    }
  }

  get currentAdditional() {
    return this.formAdditional.value as Additional;
  }

  saveAdditional() {
    if (!this.formAdditional.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: 'Ingrese todos los datos',
      });
      return;
    }

    if (!this.idAdditional) {
      this.additionalsService
        .addAdditional(this.currentAdditional)
        .subscribe((additional) => {
          if (additional) {
            //Actualizar la señal de variantes
            const additonalsUpdate = [additional, ...this.additionals()];
            this.additionals.set(additonalsUpdate);
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: 'Agregado Correctamente',
            });
          }
        });

      this.visible = false;

      return;
    }

    this.additionalsService
      .updateAdditional(this.currentAdditional, parseInt(this.idAdditional))
      .subscribe((additional) => {
        if (additional) {
          //Actualizamos las variants
          let additionalsUpdate = this.additionals().filter(
            (adi) => adi.id != additional.id
          );
          additionalsUpdate = [additional, ...additionalsUpdate];
          this.additionals.set(additionalsUpdate);
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'Editado Correctamente',
          });
        }
      });

    this.visible = false;
  }

  showDialog() {
    this.visible = true;
  }
}
