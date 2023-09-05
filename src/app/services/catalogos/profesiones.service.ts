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

  async postProfesion(data: any): Promise<any> {
    let profesion = await this.rootService.post(this.route, data);
    if (profesion.resultado) {
      await this.rootService.bitacora('profesion', 'agregar', `creó la profesion "${profesion.data.nombre}"`, profesion.data);
    }
    return profesion;
  }

  async putProfesion(id: number, data: any): Promise<any> {
    let profesion = await this.rootService.put(this.route + '/' + id, data);
    if (profesion.resultado) {
      await this.rootService.bitacora('profesion', 'editar', `editó la profesion "${profesion.data.nombre}"`, profesion.data);
    }
    return profesion;
  }

  async deleteProfesion(id: number): Promise<any> {
    let profesion = await this.rootService.delete(this.route + '/' + id);
    if (profesion.resultado) {
      await this.rootService.bitacora('profesion', 'eliminar', `eliminó la profesion "${profesion.data.nombre}"`, profesion.data);
    }
    return profesion;
  }
}
