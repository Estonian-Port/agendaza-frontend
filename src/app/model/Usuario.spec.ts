import { Usuario } from './Usuario'
import { Destino } from './Destino'
import { Itinerario } from './Itinerario'
import { localista, relajado, activo, CriterioExigente, precavido, soniador } from './Criterio'
import { Auto } from './Vehiculo'
import { caprichoso, neofilo, CriterioSelectivo, sinLimite, supersticioso, CriterioCombinado } from './CriterioVehiculo'
import { Actividad } from './Actividad'
import { Dificultad } from './Dificultad'
import { Dia } from './Dia'

describe('Tests de Usuario valido', () => {

  let usuarioJoaco : Usuario
  let usuarioPepe : Usuario
  let destinoItalia : Destino
  let destinoArgentina : Destino
  let itinerarioUno : Itinerario
  let itinerarioDos : Itinerario
  let itinerarioCuatro : Itinerario
  let itinerarioDeUsuarioExigente : Itinerario
  const criterioRelajado = relajado
  const criterioLocalista = localista
  const criterioActivo = activo
  const criterioExigente = new CriterioExigente(50, Dificultad.ALTA)
  const criterioPrecavido = precavido
  const criterioSoniador = soniador

  let actividad1: Actividad
  let actividad2: Actividad
  let actividad3: Actividad
  let actividad4: Actividad
  let actividad5: Actividad
  let unaActividadDificultadAlta1: Actividad
  let unaActividadDificultadAlta2: Actividad
  let unaActividadDificultadAlta3: Actividad
  let unaActividadDificultadMEDIA1: Actividad
  let unaActividadDificultadMEDIA2: Actividad
  let unaActividadDificultadMEDIA3: Actividad

  beforeEach(() => {
    usuarioJoaco = new Usuario('Joaquin', 'Sabina', 'sabJo', 'España', 5)
    usuarioJoaco.fechaAlta = new Date('2022-04-27')

    usuarioPepe = new Usuario('Pepe', 'Pompin', 'pepito', 'Argentina', 5)
    usuarioPepe.fechaAlta = new Date('2020-03-15')

    destinoItalia = new Destino('Italia', 'Roma', 50000)
    destinoArgentina = new Destino('Argentina', 'Mar del plata', 4000)

    itinerarioUno = new Itinerario(1, usuarioPepe, destinoItalia,[],5)
    itinerarioDos = new Itinerario(2, usuarioJoaco, destinoArgentina,[],5)
    itinerarioCuatro = new Itinerario(3, usuarioPepe, destinoArgentina,[],5)
    itinerarioDeUsuarioExigente = new Itinerario(4, usuarioJoaco, destinoArgentina,[],5)

  })

  it('Un usuario español sin antiguedad debera abonar para viajar a Roma 20% adicional, con un costo base de 50000, un total de 60000', () => {
    expect(60000).toBe(destinoItalia.calcularCosto(usuarioJoaco))
  })

  it('Pepe viaja a Italia, luego le preguntamos si conoce Italia y contesta True', () => {
    usuarioPepe.viajar(destinoItalia)
    usuarioPepe.conoceDestino(destinoItalia)
  })

  it('La antiguedad de Pepe es de 2 años', () => {
    expect(2).toBe(usuarioPepe.antiguedad())
  })

  describe('Puede realizar itinerarios', () => {

    describe('Usuario precavido', () => {
      it('Pepe es un usuario precavido, tiene más días para viajar que días de itinerario, no conoce Italia, quiere viajar y un amigo sí conoce Italia, entonces puede realizar itinerarioUno', () => {
        usuarioPepe.definirCriterioDeViaje(criterioPrecavido)
        usuarioJoaco.viajar(destinoItalia)
        usuarioPepe.agregarAmigo(usuarioJoaco)
        expect(true).toBe(usuarioPepe.puedeRealizarItinerario(destinoItalia, itinerarioUno))
      })
      it('Un usuario precavido NO puede realizar itinerarioUno porque no conoce Italia', () => {
        usuarioPepe.definirCriterioDeViaje(criterioPrecavido)
        expect(false).toBe(usuarioPepe.puedeRealizarItinerario(destinoItalia, itinerarioUno))
      })

    })

    describe('Usuario soñador', () => {
      it('Un usuario soñador puede realizar itinerarioUno porque el destino es más caro que el deseado', () => {
        usuarioPepe.agregarDestinoDeseado(destinoArgentina)
        usuarioPepe.definirCriterioDeViaje(criterioSoniador)
        expect(true).toBe(usuarioPepe.puedeRealizarItinerario(destinoItalia, itinerarioUno))
      })
      it('Un usuario soñador NO puede realizar itinerarioUno porque el destino no es el deseado y además es más barato', () => {
        usuarioPepe.agregarDestinoDeseado(destinoItalia)
        usuarioPepe.definirCriterioDeViaje(criterioSoniador)
        expect(false).toBe(usuarioPepe.puedeRealizarItinerario(destinoArgentina, itinerarioDos))
      })
    })

    describe('Usuario relajado', () => {
      it('Pepe es un usuario relajado, tiene más días para viajar que días de itinerario, entonces puede realizar itinerarioUno viajando a Italia', () => {
        usuarioPepe.definirCriterioDeViaje(criterioRelajado)
        expect(true).toBe(usuarioPepe.puedeRealizarItinerario(destinoItalia, itinerarioUno))
      })
    })


    describe('Usuario localista', () => {
      it('Pepe es un usuario localista, tiene más días para viajar que días de itinerario, puede realizar itinerarioUno viajando dentro de Argentina', () => {
        usuarioPepe.definirCriterioDeViaje(criterioLocalista)
        expect(true).toBe(usuarioPepe.puedeRealizarItinerario(destinoArgentina, itinerarioDos))
      })

      it('Pepe es un usuario localista, tiene más días para viajar que días de itinerario, NO puede realizar itinerarioUno viajando fuera de Argentina', () => {
        usuarioPepe.definirCriterioDeViaje(criterioLocalista)
        expect(false).toBe(usuarioPepe.puedeRealizarItinerario(destinoItalia, itinerarioUno))
      })

    })
    describe('Usuario activo', () => {

      actividad1 = new Actividad(500, 'Visita Coliseo', new Date('2022.09.29 10:00:00'), new Date('2022.09.29 13:50:00'), Dificultad.MEDIA)
      actividad2 = new Actividad(500, 'Panteon de Roma', new Date('2022.09.29 10:00:00'), new Date('2022.09.29 13:50:00'), Dificultad.BAJA)
      actividad3 = new Actividad(500, 'La Toscana', new Date('2022.09.29 10:00:00'), new Date('2022.09.29 13:50:00'), Dificultad.MEDIA)
      actividad4 = new Actividad(500, 'La Toscana', new Date('2022.09.29 10:00:00'), new Date('2022.09.29 13:50:00'), Dificultad.MEDIA)
      actividad5 = new Actividad(500, 'La Toscana', new Date('2022.09.29 10:00:00'), new Date('2022.09.29 13:50:00'), Dificultad.MEDIA)

      const dia1 = new Dia(1)
      dia1.agregarActividad(actividad1)
      const dia2 = new Dia(2)
      dia2.agregarActividad(actividad2)
      const dia3 = new Dia(3)
      dia3.agregarActividad(actividad3)
      const dia4 = new Dia(4)
      dia4.agregarActividad(actividad4)
      const dia5 = new Dia(5)
      dia5.agregarActividad(actividad5)

      it('Pepe es un usuario activo, tiene más días para viajar que días de itinerario, puede realizarItinerarioCuatro ya que hay actividades todos los dias', () => {

        usuarioPepe.definirCriterioDeViaje(criterioActivo)
        itinerarioCuatro.agregarUnDia(dia1)
        itinerarioCuatro.agregarUnDia(dia2)
        itinerarioCuatro.agregarUnDia(dia3)
        itinerarioCuatro.agregarUnDia(dia4)
        itinerarioCuatro.agregarUnDia(dia5)
        expect(true).toBe(usuarioPepe.puedeRealizarItinerario(destinoItalia, itinerarioCuatro))
      })

    })

    describe('Usuario exigente', () => {

      unaActividadDificultadAlta1 = new Actividad(10, 'nada', new Date('2022.09.29 10:00:00'), new Date('2022.09.29 13:50:00'), Dificultad.ALTA)
      unaActividadDificultadAlta2 = new Actividad(10, 'nada', new Date('2022.09.29 10:00:00'), new Date('2022.09.29 13:50:00'), Dificultad.ALTA)
      unaActividadDificultadAlta3 = new Actividad(10, 'nada', new Date('2022.09.29 10:00:00'), new Date('2022.09.29 13:50:00'), Dificultad.ALTA)
      unaActividadDificultadMEDIA1 = new Actividad(10, 'nada', new Date('2022.09.29 10:00:00'), new Date('2022.09.29 13:50:00'), Dificultad.MEDIA)
      unaActividadDificultadMEDIA2 = new Actividad(10, 'nada', new Date('2022.09.29 10:00:00'), new Date('2022.09.29 13:50:00'), Dificultad.MEDIA)
      unaActividadDificultadMEDIA3 = new Actividad(10, 'nada', new Date('2022.09.29 10:00:00'), new Date('2022.09.29 13:50:00'), Dificultad.MEDIA)

      const dia1 = new Dia(1)
      dia1.agregarActividad(unaActividadDificultadAlta1)
      const dia2 = new Dia(2)
      dia2.agregarActividad(unaActividadDificultadAlta2)
      const dia3 = new Dia(3)
      dia3.agregarActividad(unaActividadDificultadAlta3)
      const dia4 = new Dia(4)
      dia4.agregarActividad(unaActividadDificultadMEDIA1)
      const dia5 = new Dia(5)
      dia5.agregarActividad(unaActividadDificultadMEDIA2)
      const dia6 = new Dia(6)
      dia6.agregarActividad(unaActividadDificultadMEDIA3)

      it('Pepe es un usuario exigente, tiene más días para viajar que días de itinerario, puede realizarItinerarioTres ya que desea que el 50% de su Itinerario sea de dificultad Media', () => {
        usuarioJoaco.definirCriterioDeViaje(criterioExigente)
        itinerarioDeUsuarioExigente.agregarUnDia(dia1)
        itinerarioDeUsuarioExigente.agregarUnDia(dia2)
        itinerarioDeUsuarioExigente.agregarUnDia(dia3)
        itinerarioDeUsuarioExigente.agregarUnDia(dia4)
        itinerarioDeUsuarioExigente.agregarUnDia(dia5)
        expect(true).toBe(usuarioJoaco.puedeRealizarItinerario(destinoArgentina, itinerarioDeUsuarioExigente))
      })

    })
  })

  describe('Puede puntuar itinenarios', () => {
    it('Pepe es creador del itinerarioUno y no lo puede puntuar', () => {
      expect(false).toBe(usuarioPepe.puedePuntuarItinenario(itinerarioUno))
    })

    it('Pepe no es creador del itinerarioDos, el creador es Joaco y lo puede puntuar', () => {
      usuarioPepe.viajar(destinoArgentina)
      expect(true).toBe(usuarioPepe.puedePuntuarItinenario(itinerarioDos))
    })
  })

  describe('Puede utilizar vehiculo', () => {

    let usuarioRoberto : Usuario
    const autoNuevo = new Auto('Auto','Honda', 'GTX201', 2021, 10.0, false, false)
    const autoAudi = new Auto('Auto','Audi', 'EAS463', 2020, 15, false, false)
    const vehiculoAuto = new Auto('Auto','Honda', 'hgx200', 2012, 10, false, false)
    const autoSinLimite = new Auto('Auto','Audi', 'GDS820', 2022, 30, false, true)

    usuarioRoberto = new Usuario('Roberto', 'Sanchez', 'sandro', 'Argentina', 5)
    usuarioRoberto.fechaAlta = new Date('2022-04-27')

    const criterioNeofilo = neofilo
    const criterioSupersticioso = supersticioso
    const criterioCaprichoso = caprichoso
    const criterioSelectivo = new CriterioSelectivo('Honda')
    const criterioSinLimite = sinLimite
    const criterioCombinado = new CriterioCombinado

    describe('Usuario Neofilo', () => {
      it('Usuario con criterio de vehiculo neofilo puede utilizar un auto de antiguedad 10 años', () => {
        usuarioRoberto.definirCriterioVehiculo(criterioNeofilo)
        expect(true).toBe(usuarioRoberto.puedeUtilizarVehiculo(vehiculoAuto))
      })

      it('Usuario con criterio de vehiculo neofilo no puede utilizar un auto de antiguedad 1 año', () => {
        usuarioRoberto.definirCriterioVehiculo(criterioNeofilo)
        expect(false).toBe(usuarioRoberto.puedeUtilizarVehiculo(autoNuevo))
      })
    })

    describe('Usuario Supersticioso', () => {

      it('Usuario con criterio de vehiculo supersticioso puede utilizar un auto que se haya fabricado en un año par', () => {
        usuarioRoberto.definirCriterioVehiculo(criterioSupersticioso)
        expect(true).toBe(usuarioRoberto.puedeUtilizarVehiculo(vehiculoAuto))
      })

      it('Usuario con criterio de vehiculo supersticioso no puede utilizar un auto que se haya fabricado en un año impar', () => {
        usuarioRoberto.definirCriterioVehiculo(criterioSupersticioso)
        expect(false).toBe(usuarioRoberto.puedeUtilizarVehiculo(autoNuevo))
      })

    })

    describe('Usuario Caprichoso', () => {
      it('Usuario con criterio de vehiculo caprichoso puede utilizar un auto que tenga marca y modelo con la misma inicial', () => {
        usuarioRoberto.definirCriterioVehiculo(criterioCaprichoso)
        expect(true).toBe(usuarioRoberto.puedeUtilizarVehiculo(vehiculoAuto))
      })

      it('Usuario con criterio de vehiculo caprichoso no puede utilizar un auto que tenga marca y modelo con distinta inicial', () => {
        usuarioRoberto.definirCriterioVehiculo(criterioCaprichoso)
        expect(false).toBe(usuarioRoberto.puedeUtilizarVehiculo(autoNuevo))
      })
    })

    describe('Usuario Selectivo', () => {
      it('Usuario con criterio de vehiculo selectivo puede utilizar un auto sea de marca Honda', () => {
        usuarioRoberto.definirCriterioVehiculo(criterioSelectivo)
        expect(true).toBe(usuarioRoberto.puedeUtilizarVehiculo(vehiculoAuto))
      })

      it('Usuario con criterio de vehiculo selectivo no puede utilizar un auto marca Audi porque quiere un Honda', () => {
        usuarioRoberto.definirCriterioVehiculo(criterioSelectivo)
        expect(false).toBe(usuarioRoberto.puedeUtilizarVehiculo(autoAudi))
      })
    })

    describe('Usuario Sin Limite', () => {
      it('Usuario con criterio de vehiculo sin limite puede utilizar un auto que sea kilometraje sin limite', () => {
        usuarioRoberto.definirCriterioVehiculo(criterioSinLimite)
        expect(true).toBe(usuarioRoberto.puedeUtilizarVehiculo(autoSinLimite))
      })

      it('Usuario con criterio de vehiculo sin limite no puede utilizar un auto que no sea kilometraje sin limite', () => {
        usuarioRoberto.definirCriterioVehiculo(criterioSinLimite)
        expect(false).toBe(usuarioRoberto.puedeUtilizarVehiculo(autoNuevo))
      })
    })

    describe('Usuario Criterio Combinado', () => {

      it('Usuario con criterio de vehiculo combinado puede utilizar un auto con año de fabricacion par e inicial de modelo y marca iguales', () => {
        criterioCombinado.criterios.push(criterioSupersticioso)
        criterioCombinado.criterios.push(criterioCaprichoso)
        usuarioRoberto.definirCriterioVehiculo(criterioCombinado)
        expect(true).toBe(usuarioRoberto.puedeUtilizarVehiculo(vehiculoAuto))
      })

      // it('Usuario con criterio de vehiculo combinado no puede utilizar un auto con año de fabricacion par y que no tenga kilometraje libre', () => {
      //   criterioCombinado.criterios.push(criterioSupersticioso)
      //   criterioCombinado.criterios.push(criterioSinLimite)
      //   usuarioRoberto.definirCriterioVehiculo(criterioCombinado)
      //   expect(false).toBe(usuarioRoberto.puedeUtilizarVehiculo(vehiculoAuto))
      // })
    })
  })
})

describe('Test de usuario invalido', () => {

  const usuarioNombreVacio = new Usuario('', '', '', '', 1)
  const usuarioSinDiasParaViajar = new Usuario('Nombre', 'Apellido', 'Apodo', 'Argentina', 0)

  it('El usuario no es válido cuando alguno de sus argumentos es vacío', () => {
    expect(false).toBe(usuarioNombreVacio.esValido())
  })
  it('El usuario no es válido cuando no tiene días para viajar', () => {
    expect(false).toBe(usuarioSinDiasParaViajar.esValido())
  })
})
