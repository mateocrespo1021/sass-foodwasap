import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
   
  constructor() { }

  calcPriceFinal(price : number , iva:number):number{
    const finalPrice = price * (1 + (iva / 100));
    return finalPrice
  }

  isBusinessOpen(scheduleData: any): boolean {
    // Obtener el día y la hora actual
    const now = new Date();
    const currentDayIndex = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const currentTime = now.toTimeString().slice(0, 5); // Hora en formato HH:MM
  
    // Definir los días de la semana en español
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
  
    // Obtener el día actual en formato de texto
    const currentDayName = daysOfWeek[currentDayIndex];
  
    // Buscar el horario correspondiente al día actual
    const todaySchedule = scheduleData.schedule.find((day: any) => day.day_of_week === currentDayName);
  
    // Si el negocio está abierto hoy y la hora actual está dentro del horario de apertura y cierre
    if (todaySchedule && todaySchedule.is_open) {
      return currentTime >= todaySchedule.opening_time && currentTime <= todaySchedule.closing_time;
    }
  
    return false; // Si el negocio está cerrado
  }
  
  

}
