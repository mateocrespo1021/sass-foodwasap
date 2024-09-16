import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { VariantsService } from '../../services/variants.service';
import { Variant } from '../../interfaces/variant.interface';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-modal-variants',
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
  templateUrl: './modal-variants.component.html',
  styleUrl: './modal-variants.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalVariantsComponent implements OnInit {
  @Input()
  idProduct!: string;
  //Para el modo editar
  @Input()
  idVariant!: string;

  visible: boolean = false;
  public formVariant!: FormGroup;

  get variants() {
    return this.variantsService.currentVariants;
  }

  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private variantsService = inject(VariantsService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    //console.log('hola', this.idVariant);

    this.formVariant = this.fb.group({
      name: [
        '',
        this.idVariant ? [Validators.minLength(3)] :[ Validators.required, Validators.minLength(3)] ,
      ],
      price: ['', this.idVariant ? [] :[Validators.required]],
      id_product: [this.idProduct],
    });

    if (this.idVariant) {
      this.variantsService
        .getVariantById(this.idVariant)
        .subscribe((variant) => {
          this.formVariant.patchValue({
            name: variant?.name,
            price: variant?.price,
            id_product: variant?.id_product,
          });
        });
    }
  }

  get currentVariant() {
    return this.formVariant.value as Variant;
  }

  saveVariant() {
    if (!this.formVariant.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Rejected',
        detail: 'Ingrese todos los datos',
      });
      return;
    }

    if (!this.idVariant) {
      this.variantsService
        .addVariant(this.currentVariant)
        .subscribe((variant) => {
          if (variant) {
            //Actualizar la señal de variantes
            const variantsUpdate = [variant, ...this.variants()];
            this.variants.set(variantsUpdate);
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

    this.variantsService
      .updateVariant(this.currentVariant, parseInt(this.idVariant))
      .subscribe((variant) => {
        if (variant) {
          //Actualizamos las variants
          let variantsUpdate = this.variants().filter(
            (varian) => varian.id != variant.id
          );
          variantsUpdate = [variant, ...variantsUpdate];
          this.variants.set(variantsUpdate);
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
