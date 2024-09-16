import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Slider } from '../interfaces/slider.interface';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { Me } from '../../auth/interfaces/me.interface';

@Injectable({
  providedIn: 'root',
})
export class SlidersService {
  private userSubject = new BehaviorSubject<Me | null>(null);
  private user$ = this.userSubject.asObservable();
  private baseUrl: string = environments.baseUrl;

  private sliders = signal<Slider[]>([]);

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.authService.me().subscribe((user) => this.userSubject.next(user));
  }

  get currentSliders() {
    return this.sliders;
  }

  getSliders(): Observable<Slider[]> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          return this.httpClient.get<Slider[]>(
            `${this.baseUrl}/sliders/${user.user.tenant.business_name}`
          );
        }
        return of([]); // O manejar el caso cuando no hay tenant
      })
    );
  }


  getSliderById(id: string): Observable<Slider | undefined> {
    return this.httpClient
      .get<Slider>(`${this.baseUrl}/sliders/${id}`)
      .pipe(catchError((error) => of(undefined)));
  }

  getSearchItems(query: string): Observable<Slider[]> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          return this.httpClient
            .get<Slider[]>(
              `${this.baseUrl}/sliders/search/${user.user.tenant.business_name}`,
              {
                params: { q: query },
              }
            )
            .pipe(catchError((error) => of([])));
        }
        return of([]); // O manejar el caso cuando no hay tenant
      })
    );
  }

  addSlider(slider: any): Observable<Slider | null> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          slider.append('id_tenant', user?.user.tenant.id);
          return this.httpClient.post<Slider>(
            `${this.baseUrl}/sliders`,
            slider
          );
        }
        return of(null);
      })
    );
  }

  updateSlider(slider: any, id: number): Observable<Slider> {
    if (!id) throw Error('Slider Id is required');
    return this.httpClient.post<Slider>(
      `${this.baseUrl}/sliders/${id}`,
      slider
    );
  }

  deleteSliderById(id: number): Observable<boolean> {
    if (!id) throw Error('Slider Id is required');
    return this.httpClient.delete(`${this.baseUrl}/sliders/${id}`).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }
}
