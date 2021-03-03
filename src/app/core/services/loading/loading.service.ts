import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

interface LoadingStatus {
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new Subject<LoadingStatus>();
  loadingState = this.loadingSubject.asObservable().pipe(delay(10));
  counter = 0;

  constructor(
    @Optional() @SkipSelf() prior: LoadingService
  ) {
    if (prior) {
      return prior;
    }
  }

  /**
   * @description show the loading screen
   */
  show(): void {
    this.loadingSubject.next({ active: true } as LoadingStatus);
    this.counter++;
  }

  /**
   * @description hide the loading screen
   */
  hide(): void {
    if (this.counter > 0) {
      this.counter--;
    }
    if (this.counter === 0) {
      this.loadingSubject.next({ active: false } as LoadingStatus);
    }
  }

  /**
   * @description hide all the loading screen
   */
  hideAll(): void {
    this.counter = 0;
    this.loadingSubject.next({ active: false } as LoadingStatus);
  }

}
