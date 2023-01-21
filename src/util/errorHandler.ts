export class ErrorMensaje {
  constructor(public condicional : boolean, public mensaje : String){

  }
}

export class SuccessMensaje {
  constructor(public condicional : boolean, public mensaje : String){

  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function mostrarError(component: any, error: any): void {
  let errorMessage = ''
  if (error.status === 0) {
    errorMessage = 'No hay conexión con el backend, revise si el servidor remoto está levantado.'
  } else if (error.status === 500) {
    errorMessage = 'Hubo un error al realizar la operación. Consulte al administrador del sistema.'
    console.error(error)
  }
  component.errors.push(errorMessage)
  setTimeout(() => {
    component.errors.length = 0
  }, 5000)
}

export function mostrarErrorConMensaje(component: any, error: any): void {
  const errorMessage = (error.status === 0) ? 'No hay conexión con el backend, revise si el servidor remoto está levantado.' : error.error ? error.error.message : error.message
  component.errors.push(errorMessage)
}
