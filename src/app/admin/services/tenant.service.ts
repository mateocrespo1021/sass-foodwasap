import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Tenant } from '../interfaces/tenant.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  httpClient = inject(HttpClient);
  private baseUrl: string = environments.baseUrl;
  private authService = inject(AuthService)

  get token(){
    return this.authService.tokenSig
  }

  private tenant = signal<Tenant | any>({});

  get currentTenant() {
    return this.tenant;
  }

  getTenats(): Observable<Tenant[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.get<Tenant[]>(`${this.baseUrl}/tenants` , {headers:headers});
  }

  getTenantById(id: string): Observable<Tenant | undefined> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient
      .get<Tenant>(`${this.baseUrl}/tenants/${id}` , {headers:headers})
      .pipe(catchError((error) => of(undefined)));
  }

  getTenantByName(businessName:string):Observable<Tenant | undefined>{
    return this.httpClient
    .get<Tenant>(`${this.baseUrl}/tenants/info/${businessName}` )
    .pipe(catchError((error) => of(undefined)));
  }

  getExistBusiness(businessName: string): Observable<any | undefined> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/tenants-business/${businessName}`)
      .pipe(catchError((error) => of(false)));
  }

  addTenant(tenant: any): Observable<Tenant> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.post<Tenant>(`${this.baseUrl}/tenants`, tenant , {headers:headers});
  }

  updateTenant(tenant:any, id: number): Observable<Tenant> {
    if (!id) throw Error('Tenant Id is required');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.post<Tenant>(`${this.baseUrl}/tenants/${id}`, tenant , {headers:headers});
  }

  deleteTenantById(id: number): Observable<boolean> {
    if (!id) throw Error('Tenant Id is required');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.delete(`${this.baseUrl}/tenants/${id}` , {headers:headers}).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }
}
