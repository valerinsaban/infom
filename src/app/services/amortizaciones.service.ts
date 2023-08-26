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

  postAmortizacion(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putAmortizacion(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteAmortizacion(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }


}

