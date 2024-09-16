import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-lazy-image',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './lazy-image.component.html',
  styleUrl: './lazy-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyImageComponent { 
  ngOnInit(): void {
    if(!this.url) throw new Error('URL property is required.');
   }
 
   public hasLoaded:boolean=false

   @Input()
   public slider:boolean=false
 
   @Input()
   public url!:string
 
   @Input()
   public alt:string=''
 
   onLoad(){
     this.hasLoaded=true
   }
}
