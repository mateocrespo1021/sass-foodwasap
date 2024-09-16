import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Additional } from '../../../admin/interfaces/additional.interface';


@Component({
  selector: 'app-amount-additional',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './amount-additional.component.html',
  styleUrl: './amount-additional.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountAdditionalComponent { 
  @Input() additional!:Additional
  @Output() additionalEmit = new EventEmitter<Additional>();
  valueAdditional: number = 0;
  sum() {
    this.valueAdditional++;
    this.additional.amount = this.valueAdditional
    this.additionalEmit.emit(this.additional)
  }

  min() {
    if (this.valueAdditional == 0) return;
    this.valueAdditional--;
    this.additional.amount = this.valueAdditional
    this.additionalEmit.emit(this.additional)
  }

}
