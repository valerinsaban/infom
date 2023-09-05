import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class RegionalesService {

  constructor(private rootService: RootService) {
  }

  route = '/regionales';

  getRegionales(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getRegional(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postRegional(data: any): Promise<any> {
    let regional = await this.rootService.post(this.route, data);
    if (regional.resultado) {
      await this.rootService.bitacora('regional', 'agregar', `creó la regional "${regional.data.nombre}"`, regional.data);
    }
    return regional;
  }

  async putRegional(id: number, data: any): Promise<any> {
    let regional = await this.rootService.put(this.route + '/' + id, data);
    if (regional.resultado) {
      await this.rootService.bitacora('regional', 'editar', `editó la regional "${regional.data.nombre}"`, regional.data);
    }
    return regional;
  }

  async deleteRegional(id: number): Promise<any> {
    let regional = await this.rootService.delete(this.route + '/' + id);
    if (regional.resultado) {
      await this.rootService.bitacora('regional', 'eliminar', `eliminó la regional "${regional.data.nombre}"`, regional.data);
    }
    return regional;
  }

}
