import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Tenant } from '../interfaces/tenant.interface';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  httpClient = inject(HttpClient);
  private baseUrl: string = environments.baseUrl;

  private tenant = signal<Tenant | null>(null);

  getCurrentTenant() {
    return this.tenant;
  }

  getTenats(): Observable<Tenant[]> {
    return this.httpClient.get<Tenant[]>(`${this.baseUrl}/tenants`);
  }

  getTenantById(id: string): Observable<Tenant | undefined> {
    return this.httpClient
      .get<Tenant>(`${this.baseUrl}/tenants/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  getExistBusiness(businessName: string): Observable<any | undefined> {
    return this.httpClient
      .get<any>(`${this.baseUrl}/tenants-business/${businessName}`)
      .pipe(catchError((error) => of(false)));
  }

  addTenant(tenant: Tenant): Observable<Tenant> {
    return this.httpClient.post<Tenant>(`${this.baseUrl}/tenants`, tenant);
  }

  updateTenant(tenant: Tenant, id: number): Observable<Tenant> {
    if (!id) throw Error('Tenant Id is required');
    return this.httpClient.put<Tenant>(`${this.baseUrl}/tenants/${id}`, tenant);
  }

  deleteTenantById(id: number): Observable<boolean> {
    if (!id) throw Error('Tenant Id is required');
    return this.httpClient.delete(`${this.baseUrl}/tenants/${id}`).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }
}
