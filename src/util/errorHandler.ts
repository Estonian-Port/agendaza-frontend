export class ErrorMensaje {
  constructor(public condicional : boolean, public mensaje : String){

  }
}

export function mostrarErrorConMensaje(component: any, error: any): string {
  let errorMessage: string

  // 1. Manejo de excepciones locales lanzadas por JS/TS (ej. new Error('Usuario no autenticado'))
  if (error instanceof Error && !('status' in error)) {
    errorMessage = error.message
  }
  // 2. Errores HTTP de Angular (HttpErrorResponse / Backend Spring Boot)
  else if (error?.status !== undefined) {
    if (error.status === 0) {
      errorMessage = 'Error al conectar con el servidor. Sistema en mantenimiento.'
    } else if (error.status === 403) {
      errorMessage = 'Usuario o contraseña incorrecta.'
    } else {
      // Mapeo seguro del JSON de respuesta de Spring Boot (message o error)
      const backendError = error.error
      if (typeof backendError === 'string' && backendError.trim().length > 0) {
        errorMessage = backendError
      } else {
        errorMessage = backendError?.message || backendError?.error || backendError?.mensaje || 'Ocurrió un error inesperado.'
      }
    }
  } 
  // 3. Fallback genérico
  else {
    errorMessage = 'Ocurrió un error inesperado.'
  }

  if (component) {
    if (!component.errors) {
      component.errors = []
    }
    component.errors.push(errorMessage)
  }

  return errorMessage
}