import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class ProfesionesService {

  constructor(private rootService: RootService) {
  }

  route = '/profesiones';

  getProfesiones(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getProfesion(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postProfesion(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putProfesion(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteProfesion(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }
}
