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

  async postPuesto(data: any): Promise<any> {
    let puesto = await this.rootService.post(this.route, data);
    if (puesto.resultado) {
      await this.rootService.bitacora('puesto', 'agregar', `creó el puesto "${puesto.data.nombre}"`, puesto.data);
    }
    return puesto;
  }

  async putPuesto(id: number, data: any): Promise<any> {
    let puesto = await this.rootService.put(this.route + '/' + id, data);
    if (puesto.resultado) {
      await this.rootService.bitacora('puesto', 'editar', `editó el puesto "${puesto.data.nombre}"`, puesto.data);
    }
    return puesto;
  }

  async deletePuesto(id: number): Promise<any> {
    let puesto = await this.rootService.delete(this.route + '/' + id);
    if (puesto.resultado) {
      await this.rootService.bitacora('puesto', 'eliminar', `eliminó el puesto "${puesto.data.nombre}"`, puesto.data);
    }
    return puesto;
  }
}
