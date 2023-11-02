import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  constructor(private rootService: RootService) {
  }

  route = '/facturas';

  getFacturas(fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getFactura(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postFactura(data: any): Promise<any> {
    let factura = await this.rootService.post(this.route, data);
    if (factura.resultado) {
      await this.rootService.bitacora('factura', 'agregar', `creó la factura "${factura.data.codigo}"`, factura.data);
    }
    return factura;
  }

  async putFactura(id: number, data: any): Promise<any> {
    let factura = await this.rootService.put(this.route + '/' + id, data);
    if (factura.resultado) {
      await this.rootService.bitacora('factura', 'editar', `editó la factura "${factura.data.codigo}"`, factura.data);
    }
    return factura;
  }

  async anularFactura(id: number, data: any): Promise<any> {
    let factura = await this.rootService.put(this.route + '/anular/' + id, data);
    if (factura.resultado) {
      await this.rootService.bitacora('factura', 'anular', `anuló la factura "${factura.data.codigo}"`, factura.data);
    }
    return factura;
  }

  async deleteFactura(id: number): Promise<any> {
    let factura = await this.rootService.delete(this.route + '/' + id);
    if (factura.resultado) {
      await this.rootService.bitacora('factura', 'eliminar', `eliminó la factura "${factura.data.codigo}"`, factura.data);
    }
    return factura;
  }
}
