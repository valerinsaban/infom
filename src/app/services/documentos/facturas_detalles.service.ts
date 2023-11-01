import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class FacturasDetallesService {

  constructor(private rootService: RootService) {
  }

  route = '/facturas_detalles';

  getFacturasDetalles(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getFacturaDetalle(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postFacturaDetalle(data: any): Promise<any> {
    let factura_detalle = await this.rootService.post(this.route, data);
    return factura_detalle;
  }

  async putFacturaDetalle(id: number, data: any): Promise<any> {
    let factura_detalle = await this.rootService.put(this.route + '/' + id, data);
    return factura_detalle;
  }

  async deleteFacturaDetalle(id: number): Promise<any> {
    let factura_detalle = await this.rootService.delete(this.route + '/' + id);
    return factura_detalle;
  }
}
