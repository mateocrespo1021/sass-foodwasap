import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
   
  constructor() { }

  calcPriceFinal(price : number , iva:number):number{
    const finalPrice = price * (1 + (iva / 100));
    return finalPrice
  }

}
