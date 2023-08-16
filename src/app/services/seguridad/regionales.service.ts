import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class RegionalesService {

  constructor(private rootService: RootService) {
  }

  route = '/regionales';

  getRegionales(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getRegional(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postRegional(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putRegional(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteRegional(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }

}
