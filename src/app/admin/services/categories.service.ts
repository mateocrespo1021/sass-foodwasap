import { inject, Injectable, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  switchMap,
} from 'rxjs';
import { Category } from '../interfaces/category.interface';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Me } from '../../auth/interfaces/me.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private baseUrl: string = environments.baseUrl;

  private category = signal<Category>({} as Category);

  private categoriesSelect = signal<Category[]>([]);

  private spinner = signal<boolean>(false);

  get currentCategoriesSelect() {
    return this.categoriesSelect;
  }

  get currentCategory() {
    return this.category;
  }

  get spinnerState() {
    return this.spinner;
  }

  private userSubject = new BehaviorSubject<Me | null>(null);
  private user$ = this.userSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.authService.me().subscribe((user) => this.userSubject.next(user));
  }

  getCategories(): Observable<Category[]> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          return this.httpClient.get<Category[]>(
            `${this.baseUrl}/categories/${user.user.tenant.business_name}`
          );
        }
        return of([]); // O manejar el caso cuando no hay tenant
      })
    );
  }




  lastCategory(): Observable<Category | null> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          return this.httpClient.get<Category>(
            `${this.baseUrl}/lastcategory/${user.user.tenant.business_name}`
          );
        }
        return of(null);
      })
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

  getCategorieById(id: number): Observable<Category | undefined> {
    return this.httpClient
      .get<Category>(`${this.baseUrl}/categories-by/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  addCategory(category: any): Observable<Category | any> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          category.append('id_tenant', user?.user.tenant.id);
          return this.httpClient.post<Category>(
            `${this.baseUrl}/categories`,
            category
          );
        }
        return of(null);
      })
    );
  }

  updateCategory(category: any, id: number): Observable<Category> {
    if (!id) throw Error('Category Id is required');
    return this.httpClient.post<Category>(
      `${this.baseUrl}/categories/${id}`,
      category
    );
  }

  deleteCategoryById(id: number): Observable<boolean> {
    if (!id) throw Error('Category Id is required');
    return this.httpClient.delete(`${this.baseUrl}/categories/${id}`).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }
}
