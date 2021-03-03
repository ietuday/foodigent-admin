import { trigger, stagger, animate, style, query, transition } from '@angular/animations';

export const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0.3 }),
      stagger(100, [
        animate('0.2s', style({ opacity: 1 }))
      ])
    ], { optional: true })
  ])
]);

export const fadeInAnimation = trigger('fadeInAnimation', [
  transition(':enter', [
    style({ opacity: '0' }),
    animate('0.8s ease-out', style({ opacity: '1' })),
  ]),
]);
