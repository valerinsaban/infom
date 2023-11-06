import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {

  constructor(private rootService: RootService) {
  }

  route = '/movimientos';

  getMovimientos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getMovimiento(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  getMovimientosUltimo(id_prestamo: number): Promise<any> {
    return this.rootService.get(this.route + '/ultimo/' + id_prestamo);
  }

  getMovimientosOrdenPago(id_orden_pago: number): Promise<any> {
    return this.rootService.get(this.route + '/orden_pago/' + id_orden_pago);
  }

  getMovimientosRecibo(id_recibo: number): Promise<any> {
    return this.rootService.get(this.route + '/recibo/' + id_recibo);
  }

  getMovimientosPrestamo(id_prestamo: number): Promise<any> {
    return this.rootService.get(this.route + '/prestamo/' + id_prestamo);
  }

  async postMovimiento(data: any): Promise<any> {
    let movimiento = await this.rootService.post(this.route, data);
    if (movimiento.resultado) {
      await this.rootService.bitacora('movimiento', 'agregar', `creó el movimiento "${movimiento.data.id}"`, movimiento.data);
    }
    return movimiento;
  }

  async putMovimiento(id: number, data: any): Promise<any> {
    let movimiento = await this.rootService.put(this.route + '/' + id, data);
    if (movimiento.resultado) {
      await this.rootService.bitacora('movimiento', 'editar', `editó el movimiento "${movimiento.data.id}"`, movimiento.data);
    }
    return movimiento;
  }

  async deleteMovimiento(id: number): Promise<any> {
    let movimiento = await this.rootService.delete(this.route + '/' + id);
    if (movimiento.resultado) {
      await this.rootService.bitacora('movimiento', 'eliminar', `eliminó el movimiento "${movimiento.data.id}"`, movimiento.data);
    }
    return movimiento;
  }


}

