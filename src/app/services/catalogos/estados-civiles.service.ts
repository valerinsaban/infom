import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class EstadosCivilesService {

  constructor(private rootService: RootService) { }

  route = '/estados_civiles'

  getEstadosCiviles(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getEstadoCivil(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postEstadoCivil(data: any): Promise<any> {
    let estado_civil = await this.rootService.post(this.route, data);
    if (estado_civil.resultado) {
      await this.rootService.bitacora('estado_civil', 'agregar', `creó el estado civil "${estado_civil.data.nombre}"`, estado_civil.data);
    }
    return estado_civil;
  }

  async putEstadoCivil(id: number, data: any): Promise<any> {
    let estado_civil = await this.rootService.put(this.route + '/' + id, data);
    if (estado_civil.resultado) {
      await this.rootService.bitacora('estado_civil', 'editar', `editó el estado civil "${estado_civil.data.nombre}"`, estado_civil.data);
    }
    return estado_civil;
  }

  async deleteEstadoCivil(id: number): Promise<any> {
    let estado_civil = await this.rootService.delete(this.route + '/' + id);
    if (estado_civil.resultado) {
      await this.rootService.bitacora('estado_civil', 'eliminar', `eliminó el estado civil "${estado_civil.data.nombre}"`, estado_civil.data);
    }
    return estado_civil;
  }

}
