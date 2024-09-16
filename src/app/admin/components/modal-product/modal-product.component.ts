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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileComponent } from '../file/file.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from '../../services/categories.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-modal-product',
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
  ],
  templateUrl: './modal-product.component.html',
  styleUrl: './modal-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalProductComponent implements OnInit {
  visible: boolean = false;
  public formProduct!: FormGroup;
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService)
  private messageService = inject(MessageService);

  get category(){
    return this.categoriesService.currentCategory
  }

  get products(){
    return this.productsService.currentProducts
  }

  get loading(){
    return this.productsService.loading
  }

  ngOnInit(): void {
    this.formProduct = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      image: ['', [Validators.required]],
    });
  }

  showDialog() {
    this.visible = true;
  }

  saveProduct() {
   

    if (!this.formProduct.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ingrese todos los datos',
      });
      return;
    }

    //Form Data por la imagen
    const formData = new FormData();

    formData.append('name', this.formProduct.controls['name'].value);

    formData.append(
      'description',
      this.formProduct.controls['description'].value
    );

    formData.append('price', this.formProduct.controls['price'].value);

    formData.append('image', this.formProduct.controls['image'].value);

    formData.append('id_category', this.category().id + '');

    this.loading.set(true) 
    this.productsService.addProduct(formData).subscribe((product) => {
      if (product) { 
       // console.log(product);
        
        const productsUpdate = [product ,...this.products()]
        this.products.set(productsUpdate)
        this.loading.set(false)
        this.messageService.add({
          severity: 'info',
          summary: 'Agregado Correctamente',
        });
        this.formProduct.reset()
        return;
      }

      this.messageService.add({
        severity: 'error',
        summary: 'No se pudo agregar el producto',
      });
    });

    this.visible = false;
  }

  handleFileUploaded(files: any) {
    // Aquí puedes manejar los archivos cargados, como enviarlos a un servicio o realizar cualquier otra acción necesaria
    if (files && files.length > 0) {
      const file = files[0]; // Suponiendo que solo se permite subir un archivo
      this.formProduct.patchValue({
        image: file, // Asigna el archivo cargado al campo 'image' del formulario
      });
    }
  }
}
