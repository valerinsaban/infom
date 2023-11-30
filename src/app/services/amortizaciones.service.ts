import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class AmortizacionesService {

  constructor(private rootService: RootService) {
  }

  route = '/amortizaciones';

  getAmortizaciones(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getAmortizacionesCobro(id_cobro: number): Promise<any> {
    return this.rootService.get(this.route + '/cobro/' + id_cobro);
  }

  getAmortizacionesPrograma(id_programa: number): Promise<any> {
    return this.rootService.get(this.route + '/programa/' + id_programa);
  }

  getAmortizacionesProgramaMes(id_programa: number, mes: string): Promise<any> {
    return this.rootService.get(this.route + '/programa/mes/' + id_programa + '/' + mes);
  }

  getAmortizacionesPrestamo(id_prestamo: number): Promise<any> {
    return this.rootService.get(this.route + '/prestamo/' + id_prestamo);
  }

  getAmortizacionesServicio(id_prestamo: number): Promise<any> {
    return this.rootService.get(this.route + '/servicio/' + id_prestamo);
  }

  getAmortizacionesPrestamoMes(id_prestamo: number, mes: string): Promise<any> {
    return this.rootService.get(this.route + '/prestamo/mes/' + id_prestamo + '/' + mes);
  }

  getAmortizacion(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postAmortizacion(data: any): Promise<any> {
    let cobro_detalle = await this.rootService.post(this.route, data);
    return cobro_detalle;
  }

  async putAmortizacion(id: number, data: any): Promise<any> {
    let cobro_detalle = await this.rootService.put(this.route + '/' + id, data);
    return cobro_detalle;
  }

  async deleteAmortizacion(id: number): Promise<any> {
    let cobro_detalle = await this.rootService.delete(this.route + '/' + id);
    return cobro_detalle;
  }
}
