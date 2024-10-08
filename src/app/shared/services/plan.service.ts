import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environments } from '../../../environments/environments';
import { Plan } from '../interfaces/plan.interface';


@Injectable({
  providedIn: 'root'
})
export class PlanService {

  httpClient = inject(HttpClient);
  private baseUrl: string = environments.baseUrl;

  getPlans(): Observable<Plan[]> {
    return this.httpClient.get<Plan[]>(`${this.baseUrl}/plans`);
  }

  getPlanById(id: string | number): Observable<Plan | undefined> {
    return this.httpClient
      .get<Plan>(`${this.baseUrl}/plans/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  addPlan(plan: Plan): Observable<Plan> {
    return this.httpClient.post<Plan>(`${this.baseUrl}/plans`, plan);
  }

  updatePlan(plan: Plan, id: number): Observable<Plan> {
    if (!id) throw Error('Plan Id is required');
    return this.httpClient.put<Plan>(`${this.baseUrl}/plans/${id}`, plan);
  }

  deletePlanById(id: number): Observable<boolean> {
    if (!id) throw Error('Plan Id is required');
    return this.httpClient.delete(`${this.baseUrl}/plans/${id}`).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }

}
