import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileComponent } from '../file/file.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '../../interfaces/category.interface';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';
import { environments } from '../../../../environments/environments';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    InputSwitchModule,
    FileComponent,
    ButtonModule,
    DropdownModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
})
export class EditProductComponent implements OnInit {
  categories: Category[] | undefined;

  @Input()
  id!: string;

  public product!: Product;

  public formProducts!: FormGroup;

  public category!: Category;

  public baseProducts: string = environments.baseProducts;

  private fb = inject(FormBuilder);

  private categoriesService = inject(CategoriesService);

  private productsService = inject(ProductsService);

  private messageService = inject(MessageService);

  public newImage: string = '';
  ngOnInit() {
    //  console.log(this.id);

    this.formProducts = this.fb.group({
      name: ['', [Validators.minLength(3)]],
      price: ['', [Validators.min(1)]],
      description: ['', [Validators.minLength(3)]],
      discount: ['', []],
      iva: ['', []],
      status: ['', []],
      category: ['', []],
      image: ['', []],
    });

    this.productsService.getProductsById(this.id).subscribe((product) => {
      //console.log(product);

      if (product) {
        this.product = product;
        this.categoriesService
          .getCategorieById(this.product.id_category)
          .subscribe((category) => {
            if (category) {
              this.category = category;
              this.formProducts.patchValue({
                name: this.product.name,
                price: this.product.price,
                description: this.product.description,
                discount: this.product.discount,
                iva: this.product.iva,
                category: this.category,
                status: this.product.status == 1 ? true : '',
              });
            }
          });
      }
    });
    this.categoriesService
      .getCategories()
      .subscribe((categories) => (this.categories = categories));
  }

  editProduct() {
    if (!this.formProducts.valid) {
      return;
    }

    const formData = new FormData();
    if (this.formProducts.controls['name'].value) {
      formData.append('name', this.formProducts.controls['name'].value);
    }

    if (this.formProducts.controls['price'].value) {
      formData.append('price', this.formProducts.controls['price'].value);
    }

    if (this.formProducts.controls['description'].value) {
      formData.append(
        'description',
        this.formProducts.controls['description'].value
      );
    }

    if (this.formProducts.controls['discount'].value) {
      formData.append('discount', this.formProducts.controls['discount'].value);
    }

    if (this.formProducts.controls['iva'].value) {
      formData.append('iva', this.formProducts.controls['iva'].value);
    }

    if (this.formProducts.controls['category'].value) {
      formData.append(
        'id_category',
        this.formProducts.controls['category'].value.id
      );
    }

    const value = this.formProducts.controls['status'].value == true ? 1 : 0;
    formData.append('status', value + '');

    if (this.formProducts.controls['image'].value) {
      formData.append('image', this.formProducts.controls['image'].value);
    }

    this.productsService
      .updateProducts(formData, this.product.id)
      .subscribe((product) => {
        if (product) {
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'Editado Correctamente',
          });
        }
      });
  }

  handleFileUploaded(files: any) {
    // Aquí puedes manejar los archivos cargados, como enviarlos a un servicio o realizar cualquier otra acción necesaria
    if (files && files.length > 0) {
      const file = files[0]; // Suponiendo que solo se permite subir un archivo
      // console.log(file.objectURL.changingThisBreaksApplicationSecurity);
      this.newImage = file.objectURL.changingThisBreaksApplicationSecurity;

      this.formProducts.patchValue({
        image: file, // Asigna el archivo cargado al campo 'image' del formulario
      });
    }
  }
}
