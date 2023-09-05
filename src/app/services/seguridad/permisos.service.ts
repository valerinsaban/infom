import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  constructor(private rootService: RootService) { }
  
  route = '/permisos';

  getPermisos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getPermiso(accion: string, id_permiso: number, id_menu: number, id_submenu: number): Promise<any> {
    return this.rootService.get(this.route + '/' + accion + '/' + id_permiso + '/' + id_menu + '/' + id_submenu);
  }

  getPermisoRol(id_permiso: number): Promise<any> {
    return this.rootService.get(this.route + '/rol/' + id_permiso);
  }

  async postPermiso(data: any): Promise<any> {
    let permiso = await this.rootService.post(this.route, data);
    if (permiso.resultado) {
      await this.rootService.bitacora('permiso', 'agregar', `creó el permiso "${permiso.data.nombre}"`, permiso.data);
    }
    return permiso;
  }

  async putPermiso(id: number, data: any): Promise<any> {
    let permiso = await this.rootService.put(this.route + '/' + id, data);
    if (permiso.resultado) {
      await this.rootService.bitacora('permiso', 'editar', `editó el permiso "${permiso.data.nombre}"`, permiso.data);
    }
    return permiso;
  }

  async deletePermiso(id: number): Promise<any> {
    let permiso = await this.rootService.delete(this.route + '/' + id);
    if (permiso.resultado) {
      await this.rootService.bitacora('permiso', 'eliminar', `eliminó el permiso "${permiso.data.nombre}"`, permiso.data);
    }
    return permiso;
  }

}
