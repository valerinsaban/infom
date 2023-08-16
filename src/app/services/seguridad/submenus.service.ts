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

  postSubmenu(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putSubmenu(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteSubmenu(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }

}
