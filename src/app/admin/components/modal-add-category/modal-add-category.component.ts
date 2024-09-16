import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environments } from '../../../../environments/environments';
import { CategoriesService } from '../../services/categories.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileComponent } from '../file/file.component';
import { ProductsService } from '../../services/products.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-modal-add-category',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule,FileComponent,ReactiveFormsModule],
  templateUrl: './modal-add-category.component.html',
  styleUrl: './modal-add-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalAddCategoryComponent {
  
  public baseCategories: string = environments.baseCategories;
  private messageService = inject(MessageService);

  public formCategory!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private toastr: ToastrService,
    private productsService : ProductsService
  ) {}

  get spinner() {
    return this.categoriesService.spinnerState;
  }

  get category() {
    return this.categoriesService.currentCategory;
  }

  get products(){
    return this.productsService.currentProducts
  }

  get currentSelectedCategories(){
    return this.categoriesService.currentCategoriesSelect
  }

  ngOnInit(): void {
    this.formCategory = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      image: ['', [Validators.required]],
    });
  }

  onSubmit() {
    //  console.log(this.formCategory.valid)
    if (!this.formCategory.valid) {
      this.toastr.error('Validation', 'Ingrese todos los campos porfavor.');
      return;
    }

    const formData = new FormData();

    formData.append('name', this.formCategory.controls['name'].value);

    formData.append('image', this.formCategory.controls['image'].value);

    //Guardamos la categoria

    this.spinner.set(true);
    this.categoriesService.addCategory(formData).subscribe((category) => {
      this.spinner.set(false);
      if (category) {
        this.messageService.add({
          severity: 'info',
          summary: 'Agregado Correctamente',
        });
        //Limpiar el formulario
        this.formCategory.reset()
        this.category.set(category)
        //Cargar los productos
        this.productsService.getProductsByCategory(category.id).subscribe(products => this.products.set(products))
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
