import { Injectable, inject, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Additional } from '../interfaces/additional.interface';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdditionalsService {
  private baseUrl: string = environments.baseUrl;

  private httpClient = inject(HttpClient);

  private additionals = signal<Additional[]>([])

  get currentAdditionals(){
    return this.additionals
  }

  getAdditionals(): Observable<Additional[]> {
    return this.httpClient.get<Additional[]>(`${this.baseUrl}/additionals`);
  }

  getAdditionalById(id: string): Observable<Additional | undefined> {
    return this.httpClient
      .get<Additional>(`${this.baseUrl}/additionals/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  getAdditionalsByProduct(id: string): Observable<Additional[] | undefined> {
    return this.httpClient
      .get<Additional[]>(`${this.baseUrl}/additionals/product/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  addAdditional(additional: Additional): Observable<Additional> {
    return this.httpClient.post<Additional>(`${this.baseUrl}/additionals`, additional);
  }

  updateAdditional(additional: Additional, id: number): Observable<Additional> {
    if (!id) throw Error('Additional Id is required');
    return this.httpClient.put<Additional>(
      `${this.baseUrl}/additionals/${id}`,
      additional
    );
  }

  deleteAdditionalById(id: number): Observable<boolean> {
    if (!id) throw Error('Additional Id is required');
    return this.httpClient.delete(`${this.baseUrl}/additionals/${id}`).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }

}
