import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class RegionesService {

  constructor(private rootService: RootService) { }

  route = '/regiones';

  getRegiones(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getRegion(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postRegion(data: any): Promise<any> {
    let region = await this.rootService.post(this.route, data);
    if (region.resultado) {
      await this.rootService.bitacora('region', 'agregar', `creó la region "${region.data.nombre}"`, region.data);
    }
    return region;
  }

  async putRegion(id: number, data: any): Promise<any> {
    let region = await this.rootService.put(this.route + '/' + id, data);
    if (region.resultado) {
      await this.rootService.bitacora('region', 'editar', `editó la region "${region.data.nombre}"`, region.data);
    }
    return region;
  }

  async deleteRegion(id: number): Promise<any> {
    let region = await this.rootService.delete(this.route + '/' + id);
    if (region.resultado) {
      await this.rootService.bitacora('region', 'eliminar', `eliminó elal region "${region.data.nombre}"`, region.data);
    }
    return region;
  }

}
