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

  getPermiso(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  getPermisoRol(accion: string, id_rol: number, id_menu: number, id_submenu: number): Promise<any> {
    return this.rootService.get(this.route + '/' + accion + '/' + id_rol + '/' + id_menu + '/' + id_submenu);
  }

  postPermiso(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putPermiso(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deletePermiso(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }

}
