import { HttpClientModule } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

import { PerfilUsuarioComponent } from './perfil-usuario.component'

describe('PerfilUsuarioComponent', () => {
  let component: PerfilUsuarioComponent
  let fixture: ComponentFixture<PerfilUsuarioComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilUsuarioComponent ],
      imports: [ FormsModule, HttpClientModule ],
      providers: [ ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(PerfilUsuarioComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('Al poner un nombre vacío, veo el error en pantalla', () => {
    component.nombreDeUsuarioAMostrar = ''
    fixture.detectChanges()
    expect(getByTestID('usuarioInvalido')).toBeTruthy


  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  function getByTestID(testid : string) {
    const resultHtml = fixture.debugElement.nativeElement
    return resultHtml.querySelector(`[data-testid="${testid}"]`)
  }
})
