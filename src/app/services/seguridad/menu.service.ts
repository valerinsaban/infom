import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private rootService: RootService) { }
  route = '/menu';

  getMenus(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getMenu(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postMenu(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putMenu(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteMenu(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }

}
