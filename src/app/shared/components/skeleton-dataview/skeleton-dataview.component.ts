import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { DataViewModule } from 'primeng/dataview';
import { Product } from '../../../admin/interfaces/product.interface';
@Component({
  selector: 'app-skeleton-dataview',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonModule,
    DataViewModule
  ],
  
  templateUrl: './skeleton-dataview.component.html',
  styleUrl: './skeleton-dataview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonDataviewComponent { 

  @Input()
  products!:Product[]

  layout: string = 'list';
  counterArray(n: number): any[] {
    return Array(n);
}

}
