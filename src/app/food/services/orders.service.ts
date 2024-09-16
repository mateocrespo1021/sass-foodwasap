import { HttpClient } from '@angular/common/http';
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
          return this.httpClient.get<Order[]>(`${this.baseUrl}/orders`, {
            params: { id_tenant: user.user.tenant.id },
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
          return this.httpClient.get<Order[]>(`${this.baseUrl}/orders/status`, {
            params: { id_tenant: user.user.tenant.id,status:status },
          });
        }
        return of([]); // O manejar el caso cuando no hay tenant
      })
    );
  }

  getSearchItems(query: string): Observable<Order[]> {
    return this.httpClient
      .get<Order[]>(`${this.baseUrl}/orders/search`, { params: { q: query } })
      .pipe(catchError((error) => of([])));
  }

  pollOrders(intervalTime: number): Observable<Order[]> {
    return interval(intervalTime).pipe(switchMap(() => this.getOrders()));
  }

  addOrder(order: Order): Observable<Order> {
    return this.httpClient.post<Order>(`${this.baseUrl}/orders`, order);
  }

  updateStatusOrder(id: number): Observable<any> {
    if (!id) throw Error('Order Id is required');
    return this.httpClient.put<Order>(`${this.baseUrl}/orders/${id}`, null);
  }
}
