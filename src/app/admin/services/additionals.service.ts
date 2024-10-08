import { Injectable, inject, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Additional } from '../interfaces/additional.interface';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdditionalsService {
  private baseUrl: string = environments.baseUrl;

  private httpClient = inject(HttpClient);

  private authService = inject(AuthService)
  private additionals = signal<Additional[]>([])

  get currentAdditionals(){
    return this.additionals
  }

  get token(){
    return this.authService.tokenSig
  }


  getAdditionals(): Observable<Additional[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.get<Additional[]>(`${this.baseUrl}/additionals`, {headers:headers});
  }

  getAdditionalById(id: string): Observable<Additional | undefined> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient
      .get<Additional>(`${this.baseUrl}/additionals/${id}` , {headers:headers})
      .pipe(catchError((error) => of(undefined)));
  }

  getAdditionalsByProduct(id: string): Observable<Additional[] | undefined> {
    return this.httpClient
      .get<Additional[]>(`${this.baseUrl}/additionals/product/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  addAdditional(additional: Additional): Observable<Additional> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.post<Additional>(`${this.baseUrl}/additionals`, additional , {headers:headers});
  }

  updateAdditional(additional: Additional, id: number): Observable<Additional> {
    if (!id) throw Error('Additional Id is required');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.put<Additional>(
      `${this.baseUrl}/additionals/${id}`,
      additional , {headers:headers}
    );
  }

  deleteAdditionalById(id: number): Observable<boolean> {
    if (!id) throw Error('Additional Id is required');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.delete(`${this.baseUrl}/additionals/${id}` , {headers:headers}).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }

}
