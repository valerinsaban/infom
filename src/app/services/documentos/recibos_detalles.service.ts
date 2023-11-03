import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class RecibosDetallesService {

  constructor(private rootService: RootService) {
  }

  route = '/recibos_detalles';

  getRecibosDetalles(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getReciboDetalle(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postReciboDetalle(data: any): Promise<any> {
    let recibo = await this.rootService.post(this.route, data);
    return recibo;
  }

  async putReciboDetalle(id: number, data: any): Promise<any> {
    let recibo = await this.rootService.put(this.route + '/' + id, data);
    return recibo;
  }

  async deleteReciboDetalle(id: number): Promise<any> {
    let recibo = await this.rootService.delete(this.route + '/' + id);
    return recibo;
  }
}
