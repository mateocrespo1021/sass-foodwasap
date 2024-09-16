import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
@Injectable({
  providedIn: 'root',
})
export class EchoService {
  private echo: Echo;
  //private pusher : Pusher;
  constructor() {
    //this.pusher = new Pusher()
    this.echo = new Echo({
      broadcaster: 'reverb',
      key: '1sfjg05njyncmmpc67zl',
      wsHost: 'localhost',
      wsPort: '127.0.0.1:8000',
      wssPort: '127.0.0.1:8000',
      forceTLS: 'http',
      enabledTransports: ['ws', 'wss'],
    });

    console.log(this.echo)
  }

  listenToEvents() {
    this.echo.channel('my-channel').listen('new-order', (data: any) => {
      console.log(data);
    });
  }
}
