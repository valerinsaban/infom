import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private rootService: RootService) { }

  route = '/roles'

  getRoles(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getRol(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postRol(data: any): Promise<any> {
    let rol = await this.rootService.post(this.route, data);
    if (rol.resultado) {
      await this.rootService.bitacora('rol', 'agregar', `creó el rol "${rol.data.nombre}"`, rol.data);
    }
    return rol;
  }

  async putRol(id: number, data: any): Promise<any> {
    let rol = await this.rootService.put(this.route + '/' + id, data);
    if (rol.resultado) {
      await this.rootService.bitacora('rol', 'editar', `editó el rol "${rol.data.nombre}"`, rol.data);
    }
    return rol;
  }

  async deleteRol(id: number): Promise<any> {
    let rol = await this.rootService.delete(this.route + '/' + id);
    if (rol.resultado) {
      await this.rootService.bitacora('rol', 'eliminar', `eliminó el rol "${rol.data.nombre}"`, rol.data);
    }
    return rol;
  }

}
