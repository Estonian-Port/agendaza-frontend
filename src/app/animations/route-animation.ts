import { animate, style, transition, trigger } from '@angular/animations';

export const routeAnimation = trigger('routeAnimation', [
  transition('* <=> *', [
    style({ opacity: 0, transform: 'translateY(20px)' }), // Inicia la animación con opacidad 0 y desplazamiento hacia abajo
    animate('0.3s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })) // Suaviza el movimiento hacia arriba con opacidad 1
  ])
]);