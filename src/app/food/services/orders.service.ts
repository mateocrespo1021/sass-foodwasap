import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  filter,
  interval,
  of,
  switchMap,
} from 'rxjs';
import { Order } from '../interfaces/order.interface';
import { Me } from '../../auth/interfaces/me.interface';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseUrl: string = environments.baseUrl;

  private userSubject = new BehaviorSubject<Me | null>(null);
  private user$ = this.userSubject.asObservable();

  get token(){
    return this.authService.tokenSig
  }

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.authService.me().subscribe((user) => this.userSubject.next(user));
  }

  getOrders(): Observable<Order[]> { 
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
          return this.httpClient.get<Order[]>(`${this.baseUrl}/orders`, {
            params: { id_tenant: user.user.tenant.id },
          headers: headers, // Añade el token en los headers
          });
        }
        return of([]); // O manejar el caso cuando no hay tenant
      })
    );
  }

  //${user.user.tenant.business_name}

  getOrdersStatus(status: number): Observable<Order[]> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
          return this.httpClient.get<Order[]>(`${this.baseUrl}/orders/status`, {
            params: { id_tenant: user.user.tenant.id,status:status },
            headers:headers
          });

        }
        return of([]); // O manejar el caso cuando no hay tenant
      })
    );
  }

  getSearchItems(query: string): Observable<Order[]> {
    
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
          return this.httpClient.get<Order[]>(`${this.baseUrl}/orders/search`, {
            params: { id_tenant: user.user.tenant.id , q:query},
          headers: headers, // Añade el token en los headers
          });
        }
        return of([]); // O manejar el caso cuando no hay tenant
      })
    );

  }
  

  addOrder(order: Order): Observable<Order> {
    return this.httpClient.post<Order>(`${this.baseUrl}/orders`, order);
  }

  updateStatusOrder(id: number): Observable<any> {
    if (!id) throw Error('Order Id is required');
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    
    return this.httpClient.put<any>(`${this.baseUrl}/orders/${id}`, null, { headers: headers });
  }
  
}
