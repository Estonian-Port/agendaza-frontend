import { animate, style, transition, trigger } from '@angular/animations';

//TODO mejorar para que venga de un lado y vaya para el otro al tocar atras
export const translate = trigger('translate', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('0.35s ease-in-out', style({ transform: 'translateX(0)' }))
  ]),
  transition(':leave', [
    animate('0.35s ease-in-out', style({ transform: 'translateX(-100%)' }))
  ])
])