import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FileComponent } from '../file/file.component';
import { CategoriesService } from '../../services/categories.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environments } from '../../../../environments/environments';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-edit-category',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FileComponent,
    HttpClientModule,
  ],
  templateUrl: './modal-edit-category.component.html',
  styleUrl: './modal-edit-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalEditCategoryComponent implements OnInit {
  public baseCategories: string = environments.baseCategories;
  private messageService = inject(MessageService);
  public formCategory: FormGroup = this.fb.group({
    name: [this.category().name, [Validators.minLength(3)]],
    image: [''],
  });;
  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private toastr: ToastrService
  ) {}

  get spinner() {
    return this.categoriesService.spinnerState;
  }

  get category() {
    return this.categoriesService.currentCategory;
  }

  get currentSelectedCategories(){
    return this.categoriesService.currentCategoriesSelect
  }

  ngOnInit(): void {
   
  }

  onSubmit() {
    //  console.log(this.formCategory.valid)
    if (!this.formCategory.valid) {
      this.toastr.error('Validation', 'Ingrese todos los campos porfavor.');
      return;
    }

    const formData = new FormData();
    
    if (this.formCategory.controls['name'].value) {
      formData.append('name', this.formCategory.controls['name'].value);
    }

    if (this.formCategory.controls['image'].value) {
      formData.append('image', this.formCategory.controls['image'].value);
    }
    

    //Edito Categoria

    this.spinner.set(true);
    this.categoriesService
      .updateCategory(formData, this.category().id)
      .subscribe((category) => {
        this.spinner.set(false);
        if (category) {
          this.messageService.add({
            severity: 'info',
            summary: 'Editado Correctamente',
          });
          this.category.set(category)
          this.categoriesService.getCategories().subscribe((categories)=>{
            this.currentSelectedCategories.set(categories)
          })
          return;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Intentelo otra vez porfavor',
        });
      });

    this.visible = false;
  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  handleFileUploaded(files: any) {
    // Aquí puedes manejar los archivos cargados, como enviarlos a un servicio o realizar cualquier otra acción necesaria
    if (files && files.length > 0) {
      const file = files[0]; // Suponiendo que solo se permite subir un archivo
      this.formCategory.patchValue({
        image: file, // Asigna el archivo cargado al campo 'image' del formulario
      });
    }
  }
}
