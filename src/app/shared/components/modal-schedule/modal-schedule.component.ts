import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TenantService } from '../../../admin/services/tenant.service';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-modal-schedule',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TableModule
  ],
  templateUrl: './modal-schedule.component.html',
  styleUrl: './modal-schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalScheduleComponent { 
  visible: boolean = false;
  private tenantSeervice = inject(TenantService)

  get currentTenant(){
    return this.tenantSeervice.currentTenant()
  }

  get currentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

    // Función para comparar si el local está abierto
    isOpen(day:any): boolean {
      if (!day.is_open) return false;
  
      // Obtener las horas y minutos de apertura y cierre
      const openingTime = day.opening_time;
      const closingTime = day.closing_time;
  
      // Comparar la hora actual con la hora de cierre
      return this.currentTime >= openingTime && this.currentTime <= closingTime;
    
  }
  

  get schedule(){
    if (this.currentTenant.schedule) {
      return JSON.parse(this.currentTenant.schedule)
    }
  }

  showDialog() {
      this.visible = true;
  }
}
