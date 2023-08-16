import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class BancosService {

  constructor(private rootService: RootService) {
  }

  route = '/bancos';

  getBancos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getBanco(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postBanco(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putBanco(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteBanco(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }
}
