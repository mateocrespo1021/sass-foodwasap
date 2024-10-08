import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Login } from '../interfaces/login.interface';
import { Register } from '../interfaces/register.interface';
import { environments } from '../../../environments/environments';
import { Me, TenantMe } from '../interfaces/me.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environments.baseUrl;
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';
  private token: string | null = null;
  private tokenSignal = signal<string | null>('')

  get tokenSig(){
    return this.tokenSignal()
  }

 
  constructor(private http: HttpClient, public router: Router) {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      // Aquí puedes usar localStorage
      this.loadToken()
    }
  
  }

  //El token actual del tenant usuario
  private loadToken(): void {
    this.token = localStorage.getItem('token');
    this.tokenSignal.set(this.token)


  }

  login(email: string, password: string): Observable<Login> {
    let URL = this.baseUrl + '/auth/login';
    return this.http.post<Login>(URL, { email, password }).pipe(
      map((resp: Login) => {
       this.saveLocalStorage(resp);
       this.loadToken()
        return resp;
      }),
      catchError((err: any) => {
        // console.log(err);
        return of(err);
      })
    );
  }

  loginGoogle(token : any){
    let URL = this.baseUrl + '/auth/login/google';
    return this.http.post<Login>(URL, { token : token }).pipe(
      map((resp: Login) => {
       this.saveLocalStorage(resp);
       this.loadToken()
        return resp;
      }),
      catchError((err: any) => {
        // console.log(err);
        return of(err);
      })
    );
  }

  saveLocalStorage(resp: Login): boolean {
    if (resp && resp.access_token) {
      localStorage.setItem('token', resp.access_token);
      localStorage.setItem('user', JSON.stringify(resp.user));
      return true;
    }

    return false;
  }

  getUserAuth():Observable<Me | any>{
    if (!this.isLocalStorageAvailable){
      return of(false)
    }
      const token = localStorage.getItem('token') ?? '';

      if (!token) {
        return of(false);
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      return this.http.post<Me>(`${this.baseUrl}/auth/me`, {}, { headers })
        .pipe(
          map(response => response),
          catchError(() => of(false)) // Si hay algún error, devuelve false
        );
  }


  me():Observable<Me>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post<Me>(
      `${this.baseUrl}/auth/me`,
      {} , {headers}
    );

  }


  //Guardian que protegue las rutas de admin ,
  //solo podran entrar los tengan un tenant asignado y el admin
  //independiente si se haya acabo el plan 
 checkAuthentication(): Observable<boolean> {
  if (!this.isLocalStorageAvailable){
    return of(false)
  }
    const token = localStorage.getItem('token') ?? '';

    if (!token) {
      return of(false);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Me>(`${this.baseUrl}/auth/me`, {}, { headers })
      .pipe(
        map(response => {
          if (response.user.tenant || response.user.admin) {
            return true
          }
          return false
        }),
        catchError(() => of(false)) // Si hay algún error, devuelve false
      );
  }

  register(register: Register): Observable<HttpErrorResponse | Register> {
    const URL = this.baseUrl + '/auth/register';
    return this.http
      .post<Register>(URL, register)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    //console.error('An error occurred:', error);
    return throwError(() => new Error(error.error));
  }

  verifiedEmailAuth(data: any): Observable<any> {
    const URL = `${this.baseUrl}/auth/verified-auth`;
    return this.http.post<any>(URL, data).pipe(
      catchError((error) => {
       // console.error('Error occurred:', error);
        return throwError(() => new Error('Something went wrong, please try again later.'));
      })
    );
  }
  

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  
    setTimeout(() => {
      this.router.navigateByUrl('/tenant/login');
    }, 500);
  }
}
