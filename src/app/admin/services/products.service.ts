import { Injectable, signal } from '@angular/core';
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
import { Product } from '../interfaces/product.interface';
import { AuthService } from '../../auth/services/auth.service';
import { Me } from '../../auth/interfaces/me.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl: string = environments.baseUrl;

  private products = signal<Product[]>([]);
  //Signal carga tabla productos
  private signalLoading = signal<boolean>(false);

  get loading() {
    return this.signalLoading;
  }

  get currentProducts() {
    return this.products;
  }
  private userSubject = new BehaviorSubject<Me | null>(null);
  private user$ = this.userSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.authService.me().subscribe((user) => this.userSubject.next(user));
  }

  getProducts(): Observable<Product[] | any> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          return this.httpClient.get<Product[]>(
            `${this.baseUrl}/products/${user.user.tenant.business_name}`
          );
        }
        return of([]); // O manejar el caso cuando no hay tenant
      })
    );
  }

  

  getRecentProducts(businessName:string | null,limit: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(
      `${this.baseUrl}/recent-products/${businessName}/${limit}`
    );
  }

  getSearchItems(businessName:string | null,query: string): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(`${this.baseUrl}/products/search/${businessName}`, {
        params: { q: query },
      })
      .pipe(catchError((error) => of([])));
  }

  getProductsById(id: string): Observable<Product | undefined> {
    return this.httpClient
      .get<Product>(`${this.baseUrl}/products-by/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

 

  getProductsByCategory(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/products/category/${id}`);
  }

  addProduct(product: any): Observable<Product | any> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          product.append('id_tenant', user?.user.tenant.id);
          return this.httpClient.post<Product>(
            `${this.baseUrl}/products`,
            product
          );
        }
        return of(null);
      })
    );
  }

  updateProducts(product: any, id: number): Observable<Product> {
    if (!id) throw Error('Product Id is required');
    return this.httpClient.post<Product>(
      `${this.baseUrl}/products/${id}`,
      product
    );
  }

  deleteProductById(id: string): Observable<boolean> {
    if (!id) throw Error('Product Id is required');
    return this.httpClient.delete(`${this.baseUrl}/products/${id}`).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }
}
