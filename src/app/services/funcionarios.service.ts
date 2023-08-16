import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class FuncionariosService {

  constructor(private rootService: RootService) {
  }

  route = '/funcionarios';

  getFuncionarios(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getFuncionario(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postFuncionario(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putFuncionario(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteFuncionario(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }


}

