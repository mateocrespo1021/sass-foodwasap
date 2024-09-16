import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-progressive-image',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './ProgressiveImage.component.html',
  styleUrl: './ProgressiveImage.component.scss',
})
export class ProgressiveImageComponent { 
  @Input({required:true}) imageUrl!:string
  @Input({required:true}) imageUrlSmall!:string
  isLoad:boolean=false
  onImageLoad(){
    this.isLoad=true
  }
}
