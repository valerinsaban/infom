import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class OficinaRegionalService {

  constructor(private rootService: RootService) { }

  route = '/oficinas_regionales';

  getOficinasRegionales(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getOficinaRegional(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postOficinaRegional(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putOficinaRegional(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteOficinaRegional(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }

}
