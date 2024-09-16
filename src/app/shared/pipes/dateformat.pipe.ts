import { formatDate } from '@angular/common';
import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDateformat',
  standalone: true,
})
export class DateformatPipe implements PipeTransform {

  private monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  private dayNames = [
    'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
  ];

  transform(value: string, format: string = 'fullDate'): string {
    const date = new Date(value);

    const dayName = this.dayNames[date.getDay()];
    const day = date.getDate();
    const monthName = this.monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    switch (format) {
      case 'fullDate':
        return `${dayName}, ${day} de ${monthName} de ${year}`;
      case 'shortDate':
        return `${day}/${date.getMonth() + 1}/${year}`;
      case 'mediumDate':
        return `${day} ${monthName} ${year}`;
      case 'fullDateTime':
        return `${dayName}, ${day} de ${monthName} de ${year}, ${hours}:${minutes}`;
      default:
        return `${dayName}, ${day} de ${monthName} de ${year}`;
    }

  }}
