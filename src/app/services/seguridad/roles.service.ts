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

  postRol(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putRol(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteRol(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }

}
