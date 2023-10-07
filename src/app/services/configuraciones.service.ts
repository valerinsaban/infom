import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesService {

  constructor(private rootService: RootService) {
  }

  route = '/configuraciones';

  getConfiguraciones(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getConfiguracion(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postConfiguracion(data: any): Promise<any> {
    let configuracion = await this.rootService.post(this.route, data);
    if (configuracion.resultado) {
      await this.rootService.bitacora('configuracion', 'agregar', `creó la configuracion "${configuracion.data.nombre}"`, configuracion.data);
    }
    return configuracion;
  }

  async putConfiguracion(id: number, data: any): Promise<any> {
    let configuracion = await this.rootService.put(this.route + '/' + id, data);
    if (configuracion.resultado) {
      await this.rootService.bitacora('configuracion', 'editar', `editó la configuracion "${configuracion.data.nombre}"`, configuracion.data);
    }
    return configuracion;
  }

  async deleteConfiguracion(id: number): Promise<any> {
    let configuracion = await this.rootService.delete(this.route + '/' + id);
    if (configuracion.resultado) {
      await this.rootService.bitacora('configuracion', 'eliminar', `eliminó la configuracion "${configuracion.data.nombre}"`, configuracion.data);
    }
    return configuracion;
  }


}

