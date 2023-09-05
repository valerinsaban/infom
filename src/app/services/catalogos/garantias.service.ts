import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class GarantiasService {

  constructor(private rootService: RootService) { }

  route = '/garantias';

  getGarantias(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getGarantia(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postGarantia(data: any): Promise<any> {
    let garantia = await this.rootService.post(this.route, data);
    if (garantia.resultado) {
      await this.rootService.bitacora('garantia', 'agregar', `creó la garantia "${garantia.data.nombre}"`, garantia.data);
    }
    return garantia;
  }

  async putGarantia(id: number, data: any): Promise<any> {
    let garantia = await this.rootService.put(this.route + '/' + id, data);
    if (garantia.resultado) {
      await this.rootService.bitacora('garantia', 'editar', `editó la garantia "${garantia.data.nombre}"`, garantia.data);
    }
    return garantia;
  }

  async deleteGarantia(id: number): Promise<any> {
    let garantia = await this.rootService.delete(this.route + '/' + id);
    if (garantia.resultado) {
      await this.rootService.bitacora('garantia', 'eliminar', `eliminó la garantia "${garantia.data.nombre}"`, garantia.data);
    }
    return garantia;
  }
}
