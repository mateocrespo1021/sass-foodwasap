import { inject, Injectable, signal } from '@angular/core';
import { CartItem } from '../interfaces/cart-item.interface';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = signal<CartItem[]>([]);
  private subtotalCart = signal<number>(0);
  private businessName: string | null = null;

  // Método para obtener el nombre del negocio en cualquier momento
  getBusinessName(): string | null {
    return this.businessName;
  }

  // Clave estática de 256 bits (32 bytes, 64 caracteres en hexadecimal)
  private readonly encryptionKey =
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // 64 caracteres = 256 bits (hexadecimal)

  constructor(private router: Router) {
    this.loadBusinessNameFromUrl();
    this.loadFromLocalStorage();
  }

  // Cargar el nombre del negocio desde la URL actual usando el Router
private loadBusinessNameFromUrl() {
  const currentUrl = this.router.url; // Obtiene la URL activa

  // Expresión regular que captura el nombre del negocio ya sea en "/store/{businessName}" o "/store/product-explorer/{businessName}"
  const businessNameMatch = currentUrl.match(/store(?:\/product-explorer)?\/([^\/]+)/);

  if (businessNameMatch && businessNameMatch[1]) {
    this.businessName = businessNameMatch[1]; // Captura el valor de 'businessName'
    console.log('Nombre del negocio capturado en el servicio:', this.businessName);
  }
}


  get subTotalCartSignal() {
    return this.subtotalCart;
  }

  get cartSignal() {
    return this.cart;
  }

   // Guardar el carrito en localStorage con la clave del negocio
   async saveCartStorage() {
    this.calcSubtotal();
    const cartData = JSON.stringify(this.cart());
    const encryptedCart = await this.encryptData(cartData);
    
    // Usa la clave única para este negocio
    localStorage.setItem(this.getLocalStorageKey(), encryptedCart);
  }

   // Cargar el carrito desde localStorage para el negocio actual
   private async loadFromLocalStorage() {
    const encryptedCart = localStorage.getItem(this.getLocalStorageKey());
    if (!encryptedCart) return;

    const decryptedCart = await this.decryptData(encryptedCart);

    this.cart.set(JSON.parse(decryptedCart));
    this.calcSubtotal();
  }


  // Genera una clave única para el carrito en localStorage usando el nombre del negocio
  private getLocalStorageKey(): string {
    return `cart_${this.businessName}`;
  }

  // Método para cifrar los datos con una clave estática de 256 bits
  private async encryptData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    // Convertir la clave hexadecimal en un ArrayBuffer (32 bytes)
    const keyBuffer = this.hexToBuffer(this.encryptionKey);

    // Importar la clave estática para usarla con AES-GCM
    const key = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    // Generar un vector de inicialización (IV)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Cifrar los datos usando AES-GCM
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encodedData
    );

    // Combinar el IV y los datos cifrados
    const encryptedArray = new Uint8Array(encryptedData);
    const encryptedBase64 = btoa(String.fromCharCode(...iv, ...encryptedArray));

    return encryptedBase64;
  }

  // Método para descifrar los datos con una clave estática de 256 bits
  private async decryptData(encryptedData: string): Promise<string> {
    const encryptedBytes = atob(encryptedData)
      .split('')
      .map((char) => char.charCodeAt(0));

    // Extraer el IV y los datos cifrados
    const iv = new Uint8Array(encryptedBytes.slice(0, 12));
    const dataBytes = new Uint8Array(encryptedBytes.slice(12));

    // Convertir la clave hexadecimal en un ArrayBuffer (32 bytes)
    const keyBuffer = this.hexToBuffer(this.encryptionKey);

    // Importar la clave estática para usarla con AES-GCM
    const key = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    // Descifrar los datos usando AES-GCM
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      dataBytes
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  }

  // Método para convertir una clave hexadecimal en un ArrayBuffer
  private hexToBuffer(hexString: string): Uint8Array {
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }
    return bytes;
  }

  calcSubtotal() {
    const totalAd = this.cart().reduce(
      (accumulator, cartItem) => accumulator + cartItem.totalAd,
      0
    );
    const totalV = this.cart().reduce(
      (accumalator, cartItem) =>
        accumalator + cartItem.totalCv * cartItem.amount,
      0
    );
    this.subtotalCart.set(totalAd + totalV);
  }
}
