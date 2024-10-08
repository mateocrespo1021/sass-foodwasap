import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private http:HttpClient) {}
  getCurrentPosition(): Observable<GeolocationPosition> {
    return new Observable((observer) => {
      if (navigator.geolocation) {
         // Configuramos las opciones directamente en el servicio
         const geolocationOptions = {
          enableHighAccuracy: true, // Usa GPS si es posible para mayor precisión
          timeout: 10000, // Espera máximo 10 segundos
          maximumAge: 0, // No usa valores en caché
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => observer.error(error),
          geolocationOptions // Aquí se pasan las opciones
        );
      } else {
        observer.error(
          new Error('Geolocation is not supported by this browser.')
        );
      }
    });
  }

  getAddress(lat: number, lng: number): Observable<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response.display_name) {
          return response.display_name;
        } else {
          throw new Error('No se pudo obtener la dirección.');
        }
      })
    );
  }
}
