import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {

  responsiveOptions: any[] = [
    {
      breakpoint: '1199px',
      numVisible: 4,
      numScroll: 4,
    },
    {
      breakpoint: '991px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '800px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '600px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  getSkeletonArray(): number[] {
    const skeletonCount = this.getSkeletonCount();
    return Array(skeletonCount).fill(0);
  }

  getSkeletonCount(): number {
    const width = window.innerWidth;

    for (let i = this.responsiveOptions.length - 1; i >= 0; i--) {
      const option = this.responsiveOptions[i];
      if (width <= parseInt(option.breakpoint)) {
        return option.numVisible;
      }
    }

    return this.responsiveOptions[0].numVisible;
  }

}
