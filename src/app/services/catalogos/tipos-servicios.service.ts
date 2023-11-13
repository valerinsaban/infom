import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class TiposServiciosService {

  constructor(private rootService: RootService) { }

  route = '/tipos_servicios';

  getTiposServicios(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getTipoServicio(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postTipoServicio(data: any): Promise<any> {
    let tipo_servicio = await this.rootService.post(this.route, data);
    if (tipo_servicio.resultado) {
      await this.rootService.bitacora('tipo_servicio', 'agregar', `creó el tipo_servicio "${tipo_servicio.data.nombre}"`, tipo_servicio.data);
    }
    return tipo_servicio;
  }

  async putTipoServicio(id: number, data: any): Promise<any> {
    let tipo_servicio = await this.rootService.put(this.route + '/' + id, data);
    if (tipo_servicio.resultado) {
      await this.rootService.bitacora('tipo_servicio', 'editar', `editó el tipo_servicio "${tipo_servicio.data.nombre}"`, tipo_servicio.data);
    }
    return tipo_servicio;
  }

  async deleteTipoServicio(id: number): Promise<any> {
    let tipo_servicio = await this.rootService.delete(this.route + '/' + id);
    if (tipo_servicio.resultado) {
      await this.rootService.bitacora('tipo_servicio', 'eliminar', `eliminó el tipo_servicio "${tipo_servicio.data.nombre}"`, tipo_servicio.data);
    }
    return tipo_servicio;
  }
}
