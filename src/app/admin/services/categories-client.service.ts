import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Category } from '../interfaces/category.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesClientService {
  private baseUrl: string = environments.baseUrl;

  constructor(private httpClient: HttpClient) {}

  getCategoriesClient(businessName:string | any): Observable<Category[]> {
    return this.httpClient.get<Category[]>(
      `${this.baseUrl}/categories-client/${businessName}`
    );
  }

  getRecentCategories(
    businessName: string | null,
    limit: number
  ): Observable<Category[]> {
    return this.httpClient.get<Category[]>(
      `${this.baseUrl}/recent-categories/${businessName}/${limit}`
    );
  }
}
