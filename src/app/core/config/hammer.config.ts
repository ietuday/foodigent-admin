import { HammerGestureConfig } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

declare var Hammer: any;

@Injectable({
    providedIn: 'root'
})
export class HammerConfig extends HammerGestureConfig {

    /**
     * @param element elements to aplay
     * @description build hammer configuration
     */
    buildHammer(element: HTMLElement): any {
        const hm = new Hammer(element, {
            touchAction: "auto",
        });
        return hm;
    }

}
