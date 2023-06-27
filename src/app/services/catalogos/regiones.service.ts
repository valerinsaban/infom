import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class RegionesService {

  constructor(private rootService: RootService) { }

  route = '/regiones';

  getRegiones(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getRegion(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postRegion(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putRegion(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteRegion(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }

}
