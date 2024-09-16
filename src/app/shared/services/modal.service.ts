import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  
  //private isVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 // public isVisible$: Observable<boolean> = this.isVisibleSubject.asObservable();

  // public isVisible:boolean=false  
  
  // constructor() {}

  // get visible (){
  //   return this.isVisible
  // }

  // openModal() {
  //  this.isVisible = true

  // }


}
