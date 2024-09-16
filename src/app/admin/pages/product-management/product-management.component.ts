import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditProductComponent } from '../../components/edit-product/edit-product.component';
import { ModalVariantsComponent } from '../../components/modal-variants/modal-variants.component';
import { VariantsComponent } from '../../components/variants/variants.component';
import { ModalAdditionalsComponent } from '../../components/modal-additionals/modal-additionals.component';
import { AdditionalsComponent } from '../../components/additionals/additionals.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../../auth/services/auth.service';


@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    EditProductComponent,
    ModalVariantsComponent,
    VariantsComponent,
    ModalAdditionalsComponent,
    AdditionalsComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss'
})
export class ProductManagementComponent implements OnInit{ 
  
  id!:any 
  private route = inject(ActivatedRoute)
  private router = inject(Router)
 
  ngOnInit(): void {
  
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id'); // Aquí obtienes el valor del parámetro
      if (this.id == '' || this.id == null || this.id == undefined || isNaN(Number(this.id))) {
        this.router.navigate(['/admin/catalog'])
        return
      }  
    });
  }

  

}
