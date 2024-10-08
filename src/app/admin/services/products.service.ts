import { Injectable, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  
  get token(){
    return this.authService.tokenSig
  }

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
          const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
          return this.httpClient.get<Product[]>(
            `${this.baseUrl}/products/${user.user.tenant.business_name}`,{
              headers:headers
            }
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

  getSearchItems(query: string): Observable<Product[]> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
          return this.httpClient.get<Product[]>(
            `${this.baseUrl}/products/search/${user.user.tenant.business_name}`,{
              params: { q: query },
              headers:headers
            }
          );
        }
        return of([]); // O manejar el caso cuando no hay tenant
      })
    );
    
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
          const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
          product.append('id_tenant', user?.user.tenant.id);
          return this.httpClient.post<Product>(
            `${this.baseUrl}/products`,
            product , {headers:headers}
          );
        }
        return of(null);
      })
    );
  }

  updateProducts(product: any, id: number): Observable<Product> {
    if (!id) throw Error('Product Id is required');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.post<Product>(
      `${this.baseUrl}/products/${id}`,
      product , {headers:headers}
    );
  }

  deleteProductById(id: string): Observable<boolean> {
    if (!id) throw Error('Product Id is required');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.delete(`${this.baseUrl}/products/${id}` , {headers:headers}).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }
}
