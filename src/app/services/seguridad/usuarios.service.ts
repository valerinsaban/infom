import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private rootService: RootService) {
  }

  route = '/usuarios';

  getUsuarios(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getUsuario(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  getUsuariosByUsuario(usuario: string): Promise<any> {
    return this.rootService.get(this.route + '/usuario/' + usuario);
  }

  getDocs(folder: number): Promise<any> {
    return this.rootService.get(this.route + '/file/docs/' + folder);
  }

  async postUsuario(data: any): Promise<any> {
    let usuario = await this.rootService.post(this.route, data);
    if (usuario.resultado) {
      await this.rootService.bitacora('usuario', 'agregar', `creó el usuario "${usuario.data.nombre}"`, usuario.data);
    }
    return usuario;
  }

  async putUsuario(id: number, data: any): Promise<any> {
    let usuario = await this.rootService.put(this.route + '/' + id, data);
    if (usuario.resultado) {
      await this.rootService.bitacora('usuario', 'editar', `editó el usuario "${usuario.data.nombre}"`, usuario.data);
    }
    return usuario;
  }

  async putPerfil(id: number, data: any): Promise<any> {
    let usuario = await this.rootService.put(this.route + '/perfil/' + id, data);
    if (usuario.resultado) {
      await this.rootService.bitacora('usuario', 'editar', `editó el usuario "${usuario.data.nombre}"`, usuario.data);
    }
    return usuario;
  }

  async putClave(id: number, data: any): Promise<any> {
    let usuario = await this.rootService.put(this.route + '/clave/' + id, data);
    if (usuario.resultado) {
      await this.rootService.bitacora('usuario', 'editar', `editó la clave del usuario "${usuario.data.nombre}"`, usuario.data);
    }
    return usuario;
  }

  async deleteUsuario(id: number): Promise<any> {
    let usuario = await this.rootService.delete(this.route + '/' + id);
    if (usuario.resultado) {
      await this.rootService.bitacora('usuario', 'eliminar', `eliminó el usuario "${usuario.data.nombre}"`, usuario.data);
    }
    return usuario;
  }

}
