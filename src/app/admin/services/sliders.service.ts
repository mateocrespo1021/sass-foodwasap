import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  get token() {
    return this.authService.tokenSig;
  }

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
          const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
          return this.httpClient.get<Slider[]>(
            `${this.baseUrl}/sliders/${user.user.tenant.business_name}` , {headers:headers}
          );
        }
        return of([]); // O manejar el caso cuando no hay tenant
      })
    );
  }

  getSliderById(id: string): Observable<Slider | undefined> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient
      .get<Slider>(`${this.baseUrl}/sliders/${id}` , {headers:headers})
      .pipe(catchError((error) => of(undefined)));
  }

  getSearchItems(query: string): Observable<Slider[]> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);          return this.httpClient
            .get<Slider[]>(
              `${this.baseUrl}/sliders/search/${user.user.tenant.business_name}`,
              {
                params: { q: query },
                headers:headers
              }
            )
            .pipe(catchError((error) => of([])));
        }
        return of([]); // O manejar el caso cuando no hay tenant
      })
    );
  }

  addSlider(slider: any): Observable<Slider | null> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.user$.pipe(
      switchMap((user) => {
        if (user?.user.tenant) {
          slider.append('id_tenant', user?.user.tenant.id);
          return this.httpClient.post<Slider>(
            `${this.baseUrl}/sliders`,
            slider, {headers:headers}
          );
        }
        return of(null);
      })
    );
  }

  updateSlider(slider: any, id: number): Observable<Slider> {
    if (!id) throw Error('Slider Id is required');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.post<Slider>(
      `${this.baseUrl}/sliders/${id}`,
      slider , {headers:headers}
    );
  }

  deleteSliderById(id: number): Observable<boolean> {
    if (!id) throw Error('Slider Id is required');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.httpClient.delete(`${this.baseUrl}/sliders/${id}` , {headers:headers}).pipe(
      map((resp) => true),
      catchError((error) => of(false))
    );
  }
}
