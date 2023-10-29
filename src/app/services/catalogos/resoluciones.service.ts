import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class ResolucionesService {

  constructor(private rootService: RootService) {
  }

  route = '/resoluciones';

  getResoluciones(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getResolucion(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postResolucion(data: any): Promise<any> {
    let resolucion = await this.rootService.post(this.route, data);
    if (resolucion.resultado) {
      await this.rootService.bitacora('resolucion', 'agregar', `creó el resolucion "${resolucion.data.nombre}"`, resolucion.data);
    }
    return resolucion;
  }

  async putResolucion(id: number, data: any): Promise<any> {
    let resolucion = await this.rootService.put(this.route + '/' + id, data);
    if (resolucion.resultado) {
      await this.rootService.bitacora('resolucion', 'editar', `editó el resolucion "${resolucion.data.nombre}"`, resolucion.data);
    }
    return resolucion;
  }

  async deleteResolucion(id: number): Promise<any> {
    let resolucion = await this.rootService.delete(this.route + '/' + id);
    if (resolucion.resultado) {
      await this.rootService.bitacora('resolucion', 'eliminar', `eliminó el resolucion "${resolucion.data.nombre}"`, resolucion.data);
    }
    return resolucion;
  }
}
