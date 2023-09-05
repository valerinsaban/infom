import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  constructor(private rootService: RootService) { }
  route = '/menus';

  getMenus(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getMenu(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postMenu(data: any): Promise<any> {
    let menu = await this.rootService.post(this.route, data);
    if (menu.resultado) {
      await this.rootService.bitacora('menu', 'agregar', `creó el menu "${menu.data.nombre}"`, menu.data);
    }
    return menu;
  }

  async putMenu(id: number, data: any): Promise<any> {
    let menu = await this.rootService.put(this.route + '/' + id, data);
    if (menu.resultado) {
      await this.rootService.bitacora('menu', 'editar', `editó el menu "${menu.data.nombre}"`, menu.data);
    }
    return menu;
  }

  async deleteMenu(id: number): Promise<any> {
    let menu = await this.rootService.delete(this.route + '/' + id);
    if (menu.resultado) {
      await this.rootService.bitacora('menu', 'eliminar', `eliminó el menu "${menu.data.nombre}"`, menu.data);
    }
    return menu;
  }

}
