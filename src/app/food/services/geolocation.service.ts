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
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => observer.error(error)
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
