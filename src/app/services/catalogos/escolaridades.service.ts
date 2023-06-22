import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class EscolaridadesService {

  constructor(private rootService: RootService) { }

  route = '/escolaridades';

  getEscolaridades(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getEscolaridad(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postEscolaridades(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putEscolaridades(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteEscolaridades(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }


}
