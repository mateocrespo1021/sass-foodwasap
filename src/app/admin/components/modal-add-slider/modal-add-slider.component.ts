import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SlidersService } from '../../services/sliders.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileComponent } from '../file/file.component';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-modal-add-slider',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    FileComponent,
    ReactiveFormsModule,
    InputSwitchModule,
  ],
  templateUrl: './modal-add-slider.component.html',
  styleUrl: './modal-add-slider.component.scss',
})
export class ModalAddSliderComponent implements OnInit {
  @ViewChild(FileComponent) fileComponent!: FileComponent;
  visible: boolean = false;
  public formSlider!: FormGroup;
  private fb = inject(FormBuilder);
  private slidersService = inject(SlidersService);
  private messageService = inject(MessageService);

  get sliders() {
    return this.slidersService.currentSliders;
  }

  ngOnInit(): void {
    this.formSlider = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      link: ['', [Validators.minLength(3)]],
      state: ['', []],
      image: ['', [Validators.required]],
    });
  }

  showDialog() {
    this.visible = true;
  }

  saveSlider() {
    if (!this.formSlider.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ingrese todos los datos',
      });
      return;
    }

    //Form Data por la imagen
    const formData = new FormData();

    formData.append('title', this.formSlider.controls['title'].value);

  
    formData.append('image', this.formSlider.controls['image'].value);

    if (this.formSlider.controls['link'].value) {
      formData.append('link', this.formSlider.controls['link'].value);
    }

    

    formData.append(
      'state',
      (this.formSlider.controls['state'].value == true ? 1 : 0).toString()
    );

    this.slidersService.addSlider(formData).subscribe((slider) => {
      if (slider) {
        // console.log(product);
        const slidersUpdate = [slider, ...this.sliders()];
        this.sliders.set(slidersUpdate);

        this.messageService.add({
          severity: 'info',
          summary: 'Agregado Correctamente',
        });
        this.formSlider.reset();
        return;
      }

      this.messageService.add({
        severity: 'error',
        summary: 'No se pudo agregar el Slider',
      });
    });

    this.visible = false;
    this.fileComponent.resetFileInput();
  }

  handleFileUploaded(files: any) {
    // Aquí puedes manejar los archivos cargados, como enviarlos a un servicio o realizar cualquier otra acción necesaria
    if (files && files.length > 0) {
      const file = files[0]; // Suponiendo que solo se permite subir un archivo
      this.formSlider.patchValue({
        image: file, // Asigna el archivo cargado al campo 'image' del formulario
      });
    }
  }
}
