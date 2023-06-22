import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class EstadoCivilService {

  constructor(private rootService: RootService) { }

  route = '/estados-civiles'

  getEstadosCiviles(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getEstadoCivil(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postEstadoCivil(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putEstadoCivil(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteEstadoCivil(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }
}
