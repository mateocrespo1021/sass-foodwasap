import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, debounceTime } from 'rxjs';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, InputTextModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  @Input()
  placeholder: string = 'Productos';
  private debouncer: Subject<string> = new Subject<string>();

  @Output()
  public onDebounce = new EventEmitter<string>();

  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(300)).subscribe((value) => {
      this.onDebounce.emit(value);
    });
  }

  onKeyPress(searchTerm: string) {
    this.debouncer.next(searchTerm);
  }
}
