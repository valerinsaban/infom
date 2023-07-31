import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class OpcionesMenuService {

  constructor(private rootService: RootService) { }

  route = '/opciones-menu';

  getOpcionesMenus(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getOpcionesMenu(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postOpcionesMenu(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putOpcionesMenu(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteOpcionesMenu(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }



}
