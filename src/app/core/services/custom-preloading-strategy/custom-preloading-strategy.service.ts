import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { timer, Observable, of } from 'rxjs';
import { flatMap, mergeMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingStrategyService implements PreloadingStrategy {

  /**
   * @description preload
   * @param route route data
   * @param load load function
   */
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data && route.data.preload ? load() : of(null);
  }

  // preload2(route: Route, load: Function): Observable<any> {
  //   const loadRoute = (delay: boolean) => delay
  //     ? timer(150).pipe(mergeMap(_ => load()))
  //     : load();
  //   return route.data && route.data.preload
  //     ? loadRoute(route.data.delay)
  //     : of(null);
  // }

}
