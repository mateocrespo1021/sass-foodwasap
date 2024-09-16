import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product.interface';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsClientService {
  private baseUrl: string = environments.baseUrl;

  constructor(private httpClient: HttpClient) {}

  getRecentProducts(
    businessName: string | null,
    limit: number
  ): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.baseUrl}/recent-products/${businessName}/${limit}`
    );
  }

  getProductsByCategoryLimit(id: number, limit: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.baseUrl}/products/category-by-limit/${id}/${limit}`
    );
  }

  getProductsByCategory(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/products/category/${id}`);
  }

  getSearchItems(businessName:string | null,query: string): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(`${this.baseUrl}/products/search/${businessName}`, {
        params: { q: query },
      })
      .pipe(catchError((error) => of([])));
  }
}
