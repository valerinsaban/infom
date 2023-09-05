import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class SubmenusService {

  constructor(private rootService: RootService) { }
  route = '/menus';

  getSubmenus(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getSubmenu(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postSubmenu(data: any): Promise<any> {
    let submenu = await this.rootService.post(this.route, data);
    if (submenu.resultado) {
      await this.rootService.bitacora('submenu', 'agregar', `creó el submenu "${submenu.data.nombre}"`, submenu.data);
    }
    return submenu;
  }

  async putSubmenu(id: number, data: any): Promise<any> {
    let submenu = await this.rootService.put(this.route + '/' + id, data);
    if (submenu.resultado) {
      await this.rootService.bitacora('submenu', 'editar', `editó el submenu "${submenu.data.nombre}"`, submenu.data);
    }
    return submenu;
  }

  async deleteSubmenu(id: number): Promise<any> {
    let submenu = await this.rootService.delete(this.route + '/' + id);
    if (submenu.resultado) {
      await this.rootService.bitacora('submenu', 'eliminar', `eliminó el submenu "${submenu.data.nombre}"`, submenu.data);
    }
    return submenu;
  }

}
