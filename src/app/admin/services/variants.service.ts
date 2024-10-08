import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Observable, catchError, map, of } from 'rxjs';
import { Variant } from '../interfaces/variant.interface';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class VariantsService {
  private httpClient = inject(HttpClient);

  private baseUrl: string = environments.baseUrl;

  private authService = inject(AuthService)

  private variants = signal<Variant[]>([])

  get currentVariants(){
    return this.variants
  }

  get token(){
    return this.authService.tokenSig
  }

  getVariants(): Observable<Variant[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.get<Variant[]>(`${this.baseUrl}/variants` , {headers:headers});
  }

  getVariantById(id: string): Observable<Variant | undefined> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient
      .get<Variant>(`${this.baseUrl}/variants/${id}`, {headers:headers})
      .pipe(catchError((error) => of(undefined)));
  }

  getVariantsByProduct(id: string): Observable<Variant[] | undefined> {
    return this.httpClient
      .get<Variant[]>(`${this.baseUrl}/variants/product/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  addVariant(variant: Variant): Observable<Variant> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.post<Variant>(`${this.baseUrl}/variants`, variant , {headers:headers});
  }

  updateVariant(variant: Variant, id: number): Observable<Variant> {
    if (!id) throw Error('Product Id is required');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.put<Variant>(
      `${this.baseUrl}/variants/${id}`,
      variant , {headers:headers}
    );
  }

  deleteVariantById(id: number): Observable<boolean> {
    if (!id) throw Error('Variant Id is required');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.delete(`${this.baseUrl}/variants/${id}` , {headers:headers}).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }
}
