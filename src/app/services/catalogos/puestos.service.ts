import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class PuestosService {

  constructor(private rootService: RootService) {
  }

  route = '/puestos';

  getPuestos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getPuesto(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postPuesto(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putPuesto(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deletePuesto(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }
}
