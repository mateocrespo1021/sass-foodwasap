import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Observable, catchError, map, of } from 'rxjs';
import { Variant } from '../interfaces/variant.interface';

@Injectable({
  providedIn: 'root',
})
export class VariantsService {
  private httpClient = inject(HttpClient);

  private baseUrl: string = environments.baseUrl;

  private variants = signal<Variant[]>([])

  get currentVariants(){
    return this.variants
  }

  getVariants(): Observable<Variant[]> {
    return this.httpClient.get<Variant[]>(`${this.baseUrl}/variants`);
  }

  getVariantById(id: string): Observable<Variant | undefined> {
    return this.httpClient
      .get<Variant>(`${this.baseUrl}/variants/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  getVariantsByProduct(id: string): Observable<Variant[] | undefined> {
    return this.httpClient
      .get<Variant[]>(`${this.baseUrl}/variants/product/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  addVariant(variant: Variant): Observable<Variant> {
    return this.httpClient.post<Variant>(`${this.baseUrl}/variants`, variant);
  }

  updateVariant(variant: Variant, id: number): Observable<Variant> {
    if (!id) throw Error('Product Id is required');
    return this.httpClient.put<Variant>(
      `${this.baseUrl}/variants/${id}`,
      variant
    );
  }

  deleteVariantById(id: number): Observable<boolean> {
    if (!id) throw Error('Variant Id is required');
    return this.httpClient.delete(`${this.baseUrl}/variants/${id}`).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }
}
