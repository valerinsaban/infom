import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class TiposPrestamosService {

  constructor(private rootService: RootService) {
  }

  route = '/tipos_prestamos';

  getTiposPrestamos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getTipoPrestamo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postTipoPrestamo(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putTipoPrestamo(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteTipoPrestamo(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }
}
