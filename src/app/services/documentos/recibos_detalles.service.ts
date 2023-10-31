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
    let factura = await this.rootService.post(this.route, data);
    if (factura.resultado) {
      await this.rootService.bitacora('factura', 'agregar', `creó la factura "${factura.data.codigo}"`, factura.data);
    }
    return factura;
  }

  async putFacturaDetalle(id: number, data: any): Promise<any> {
    let factura = await this.rootService.put(this.route + '/' + id, data);
    if (factura.resultado) {
      await this.rootService.bitacora('factura', 'editar', `editó la factura "${factura.data.codigo}"`, factura.data);
    }
    return factura;
  }

  async deleteFacturaDetalle(id: number): Promise<any> {
    let factura = await this.rootService.delete(this.route + '/' + id);
    if (factura.resultado) {
      await this.rootService.bitacora('factura', 'eliminar', `eliminó la factura "${factura.data.codigo}"`, factura.data);
    }
    return factura;
  }
}
