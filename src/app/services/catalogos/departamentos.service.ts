import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  constructor(private rootService: RootService) {
  }

  route = '/departamentos';

  getDepartamentos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getDepartamento(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postDepartamento(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putDepartamento(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteDepartamento(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }

}
