import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Output,
  ViewChild,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { EventEmitter } from '@angular/core';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-file',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, HttpClientModule],
  providers: [MessageService],
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss',
})
export class FileComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  @Output() fileUploaded: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  onUpload(event: any) {
    // console.log(event);

    this.fileUploaded.emit(event.files);
  }

  resetFileInput() {
    this.fileUpload.clear(); // Limpia la selección del archivo
  }
}
