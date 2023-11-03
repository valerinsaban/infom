import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenesPagosService {

  constructor(private rootService: RootService) {
  }

  route = '/ordenes_pagos';

  getOrdenesPagos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getOrdenPago(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  getCountOrdenesPagosFecha(fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/count/' + fecha_inicio + '/' + fecha_fin);
  }

  getOrdenesPagosPrestamo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/prestamo/' + id);
  }

  getOrdenesPagosPrestamoFecha(id: number, fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/prestamo/' + id + '/fecha/' + fecha_inicio + '/' + fecha_fin);
  }

  async postOrdenPago(data: any): Promise<any> {
    let orden_pago = await this.rootService.post(this.route, data);
    if (orden_pago.resultado) {
      await this.rootService.bitacora('orden_pago', 'agregar', `creó la orden_pago "${orden_pago.data.mes}"`, orden_pago.data);
    }
    return orden_pago;
  }

  async putOrdenPago(id: number, data: any): Promise<any> {
    let orden_pago = await this.rootService.put(this.route + '/' + id, data);
    if (orden_pago.resultado) {
      await this.rootService.bitacora('orden_pago', 'editar', `editó la orden_pago "${orden_pago.data.mes}"`, orden_pago.data);
    }
    return orden_pago;
  }

  async deleteOrdenPago(id: number): Promise<any> {
    let orden_pago = await this.rootService.delete(this.route + '/' + id);
    if (orden_pago.resultado) {
      await this.rootService.bitacora('orden_pago', 'eliminar', `eliminó la orden_pago "${orden_pago.data.mes}"`, orden_pago.data);
    }
    return orden_pago;
  }
}
