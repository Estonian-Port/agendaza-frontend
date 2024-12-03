import { HostListener, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncarTexto'
})
export class TruncarTextoPipe implements PipeTransform {

    // Variable para almacenar el tamaño de la pantalla
    screenWidth: number = window.innerWidth;

    // Método para actualizar el tamaño de la pantalla cuando se redimensiona
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      this.screenWidth = event.target.innerWidth;
    }
    
  transform(value: string, limit: number = 35): string {

    if (this.screenWidth < 610) {
      limit = 9;  // Para pantallas pequeñas, limitar el texto a 5 caracteres
    }

    if (!value) return value;
    var truncatedValue = value.length > limit ? value.substring(0, limit) + '...' : value;
    return truncatedValue.charAt(0).toUpperCase() + truncatedValue.slice(1).toLowerCase();
  }

}
