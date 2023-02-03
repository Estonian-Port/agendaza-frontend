export type UsuarioEmpresaJSON = {
    usuarioId : number
    empresaId : number
}

export class UsuarioEmpresa{

    constructor(public usuarioId: number, public empresaId: number){}
    
    static fromJson(UsuarioEmpresaJSON: UsuarioEmpresaJSON): any {
        return new UsuarioEmpresa(UsuarioEmpresaJSON.usuarioId, UsuarioEmpresaJSON.empresaId)
       }
}