import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenantBusinessService {
  
  constructor() { }

  private businessNameSignal = signal<string>('')

  get businessSignal(){
    return this.businessNameSignal
  }

  getBusinessName(route: ActivatedRoute): string | null {
    const businessName = route.snapshot.paramMap.get('businessName');
    return businessName ? businessName : 'error';
  }

  
}
