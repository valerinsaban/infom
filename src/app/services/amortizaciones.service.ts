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

  getAmortizacion(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  getAmortizacionesPrestamo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/prestamo/' + id);
  }

  async postAmortizacion(data: any): Promise<any> {
    let amortizacion = await this.rootService.post(this.route, data);
    if (amortizacion.resultado) {
      await this.rootService.bitacora('amortizacion', 'agregar', `creó la amortizacion "${amortizacion.data.id}"`, amortizacion.data);
    }
    return amortizacion;
  }

  async putAmortizacion(id: number, data: any): Promise<any> {
    let amortizacion = await this.rootService.put(this.route + '/' + id, data);
    if (amortizacion.resultado) {
      await this.rootService.bitacora('amortizacion', 'editar', `editó la amortizacion "${amortizacion.data.id}"`, amortizacion.data);
    }
    return amortizacion;
  }

  async deleteAmortizacion(id: number): Promise<any> {
    let amortizacion = await this.rootService.delete(this.route + '/' + id);
    if (amortizacion.resultado) {
      await this.rootService.bitacora('amortizacion', 'eliminar', `eliminó la amortizacion "${amortizacion.data.id}"`, amortizacion.data);
    }
    return amortizacion;
  }


}

