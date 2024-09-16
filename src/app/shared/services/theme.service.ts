import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themeLinkElement: HTMLLinkElement | null = null;

  private modeDark  = signal<boolean>(false)

  get signalModeDark(){
    return this.modeDark
  }

  constructor() {
    this.loadFromLocalStorage();
    this.themeLinkElement = document.getElementById('app-theme') as HTMLLinkElement;
    if (!this.themeLinkElement) {
      this.themeLinkElement = document.createElement('link');
      this.themeLinkElement.id = 'app-theme';
      this.themeLinkElement.rel = 'stylesheet';
      document.head.appendChild(this.themeLinkElement)
     return 
    }
    if (!this.signalModeDark()) return;
    this.themeLinkElement.href = `lara-dark-blue.css`;
  }

  switchTheme(theme: string) {
    
    if (this.themeLinkElement) {
      this.saveCartStorage()
      this.themeLinkElement.href = `${theme}.css`;
    }
  }

  saveCartStorage() {
    localStorage.setItem('darkmode', JSON.stringify(this.modeDark()));
  }

  private loadFromLocalStorage() {
    if (!localStorage.getItem('darkmode')) return;
    this.signalModeDark.set(JSON.parse(localStorage.getItem('darkmode')!));
   
  }

}
