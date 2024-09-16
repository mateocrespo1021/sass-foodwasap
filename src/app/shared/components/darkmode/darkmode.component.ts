import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-darkmode',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './darkmode.component.html',
  styleUrl: './darkmode.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkmodeComponent { 
  private themeService = inject(ThemeService)
  //public toogle : boolean =false
  public modeLight:string = 'lara-light-blue'
  public modeDark:string = 'lara-dark-blue'

 get signalModeDark(){
  return this.themeService.signalModeDark
 }

  tooglePalette(){
    this.signalModeDark.set(!this.signalModeDark())
    const mode = this.signalModeDark() ? this.modeDark : this.modeLight
    this.themeService.switchTheme(mode);

  }
}
