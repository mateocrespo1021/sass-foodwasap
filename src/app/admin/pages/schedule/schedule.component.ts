import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TenantMe, UserMe } from '../../../auth/interfaces/me.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { TenantService } from '../../services/tenant.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CalendarModule,ToastModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnInit {
  businessHoursForm!: FormGroup;
  tenant!: TenantMe;
  user!: UserMe;
  private authService = inject(AuthService);
  private tenantService = inject(TenantService);
  private messageService = inject(MessageService);

  public daysOfWeek = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  constructor(private fb: FormBuilder) {
    this.businessHoursForm = this.fb.group({});
    this.daysOfWeek.forEach((day, index) => {
      this.businessHoursForm.addControl(
        `opening_time_${index}`,
        this.fb.control('')
      );
      this.businessHoursForm.addControl(
        `closing_time_${index}`,
        this.fb.control('')
      );
      this.businessHoursForm.addControl(
        `is_open_${index}`,
        this.fb.control(true)
      ); // true: Abierto por defecto
    });
  }

  ngOnInit(): void {
    // Obtenemos el user autenticado y el tenant
    this.authService.me().subscribe((me) => {
      if (me.user) {
        this.tenant = me.user.tenant;
        this.user = me.user;
       
        // Verifica si el schedule es una cadena, si es así, lo parsea, sino lo usa directamente
        const schedule =
          typeof this.tenant.schedule === 'string' &&
          this.tenant.schedule !== ''
            ? JSON.parse(this.tenant.schedule)
            : this.tenant.schedule || [];

        // Iterar sobre los días de la semana y asignar los valores correspondientes
        schedule.schedule.forEach((daySchedule: any, index: number) => {
          this.businessHoursForm.patchValue({
            [`opening_time_${index}`]: daySchedule.opening_time
              ? new Date(`1970-01-01T${daySchedule.opening_time}:00`)
              : null,
            [`closing_time_${index}`]: daySchedule.closing_time
              ? new Date(`1970-01-01T${daySchedule.closing_time}:00`)
              : null,
            [`is_open_${index}`]: daySchedule.is_open,
          });
        });
      }
    });
  }

  onSubmit() {
    const formValues = this.businessHoursForm.value;

    // Función para formatear la hora en "HH:mm"
    const formatTime = (date: Date | null): string | null => {
      if (!date) return null;
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    // Formatear los horarios en el formato que necesitas
    const formattedSchedule = this.daysOfWeek.map((day, index) => ({
      day_of_week: day,
      opening_time: formatTime(formValues[`opening_time_${index}`]) || '00:00', // Formatear a "HH:mm"
      closing_time: formatTime(formValues[`closing_time_${index}`]) || '23:59', // Formatear a "HH:mm"
      is_open: formValues[`is_open_${index}`], // True o False basado en el formulario
    }));

    // Formateamos los datos para que coincidan con la interfaz esperada
    const tenantSchedule = {
      schedule: formattedSchedule,
    };

    this.tenantService
      .updateTenant(
        { schedule: JSON.stringify(tenantSchedule) },
        this.tenant.id
      )
      .subscribe((result) => {
        this.messageService.add({
          severity: 'info',
          summary: '',
          detail: 'Guardado Correctamente',
        });
      });
  }
}
