import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export enum ConnectinoState {
  Unknown = 'UNKNOWN',
  Online = 'ONLINE',
  Offline = 'OFFLINE'
}

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  state$ = new BehaviorSubject<ConnectinoState>(ConnectinoState.Unknown);
  online$ = this.state$.pipe(
    startWith(false),
    map(state => state === ConnectinoState.Online)
  );
  offline$ = this.state$.pipe(
    startWith(false),
    map(state => state === ConnectinoState.Offline)
  );

  constructor() {
    window.addEventListener('online', () => {
      this.state$.next(ConnectinoState.Online);
    });

    window.addEventListener('offline', () => {
      this.state$.next(ConnectinoState.Offline);
    });
  }
}
