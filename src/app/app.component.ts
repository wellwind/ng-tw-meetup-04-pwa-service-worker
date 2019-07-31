import { ApplicationRef, Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';

export interface SwAppData {
  version: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'week1-pomodoro';

  constructor(swUpdate: SwUpdate, appRef: ApplicationRef) {
    swUpdate.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
    });
    swUpdate.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });

    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const checkInterval$ = interval(3 * 1000);
    const appIsStableOrCheckNeeded$ = concat(appIsStable$, checkInterval$);

    appIsStable$.subscribe(_ => {
      console.log('stable');
    });

    appIsStableOrCheckNeeded$.subscribe(() => swUpdate.checkForUpdate());

    swUpdate.available.subscribe(event => {
      console.log(event);

      const available = event.available.appData as SwAppData;
      const current = event.current.appData as SwAppData;

      if (confirm(`New Version: ${available.version} (current: ${current.version}). Want to update?`)) {
        swUpdate.activateUpdate().then(() => document.location.reload());
      }
    });

    window.addEventListener('online', () => {
      console.log('online');
    });

    window.addEventListener('offline', () => {
      console.log('offline');
    });
  }
}
