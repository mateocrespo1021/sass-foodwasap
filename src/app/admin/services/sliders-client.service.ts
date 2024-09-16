import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { Slider } from '../interfaces/slider.interface';

@Injectable({
  providedIn: 'root'
})
export class SlidersClientService {

  private baseUrl: string = environments.baseUrl;
  constructor(
    private httpClient: HttpClient
  ) {
    
  }

  getSlidersClient(businessName:string | null): Observable<Slider[]> {
    return this.httpClient.get<Slider[]>(
    `${this.baseUrl}/sliders-client/${businessName}`
  );
}

}
