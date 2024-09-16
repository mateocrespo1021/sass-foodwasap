import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core';
import { FileComponent } from '../file/file.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SlidersService } from '../../services/sliders.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Slider } from '../../interfaces/slider.interface';
import { environments } from '../../../../environments/environments';

@Component({
  selector: 'app-modal-edit-slider',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FileComponent,
    ReactiveFormsModule,
    InputSwitchModule,
  ],
  templateUrl: './modal-edit-slider.component.html',
  styleUrl: './modal-edit-slider.component.scss',
})
export class ModalEditSliderComponent { 
  @Input()
  public slider!:Slider
  @ViewChild(FileComponent) fileComponent!: FileComponent;
  visible: boolean = false;
  public formSlider!: FormGroup;
  private fb = inject(FormBuilder);
  private slidersService = inject(SlidersService);
  private messageService = inject(MessageService);
  public baseSliders = environments.baseSliders

  get sliders() {
    return this.slidersService.currentSliders;
  }

  ngOnInit(): void {
    this.formSlider = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      link: ['', [ Validators.minLength(3)]],
      state: ['', []],
      image: ['', []],
    });

    //Cargar la informacion del slider a editar
    this.formSlider.patchValue({
      title:this.slider.title,
      link:this.slider.link,
      state:this.slider.state == 1 ? true : false 

    })
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

    if (this.formSlider.controls['image'].value) {
      formData.append('image', this.formSlider.controls['image'].value);
    }

    if (this.formSlider.controls['link'].value) {
      formData.append('link', this.formSlider.controls['link'].value);
    }

   

    formData.append(
      'state',
      (this.formSlider.controls['state'].value == true ? 1 : 0).toString()
    );

//     // Consola del contenido de FormData
// formData.forEach((value, key) => {
//   console.log(key + ': ' + value);
// });

// return

    this.slidersService.updateSlider(formData,this.slider.id).subscribe((slider) => {
     
      
      if (slider) {
        
        // console.log(product);
        const filterSliders = this.sliders().filter((sli) => sli.id != this.slider.id )
        const slidersUpdate = [slider, ...filterSliders];
        this.sliders.set(slidersUpdate);

        this.messageService.add({
          severity: 'info',
          summary: 'Editado Correctamente',
        });
        this.formSlider.reset();
        return;
      }

      this.messageService.add({
        severity: 'error',
        summary: 'No se pudo editar el Slider',
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
