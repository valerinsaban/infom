import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class AmortizacionesDetallesService {

  constructor(private rootService: RootService) {
  }

  route = '/amortizaciones_detalles';

  getAmortizacionesDetalles(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getAmortizacionDetalle(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  getAmortizacionesDetallesAmortizacion(id_amortizacion: number): Promise<any> {
    return this.rootService.get(this.route + '/amortizacion/' + id_amortizacion);
  }

  async postAmortizacionDetalle(data: any): Promise<any> {
    let amortizacion = await this.rootService.post(this.route, data);
    return amortizacion;
  }

  async putAmortizacionDetalle(id: number, data: any): Promise<any> {
    let amortizacion = await this.rootService.put(this.route + '/' + id, data);
    return amortizacion;
  }

  async deleteAmortizacionDetalle(id: number): Promise<any> {
    let amortizacion = await this.rootService.delete(this.route + '/' + id);
    return amortizacion;
  }


}

