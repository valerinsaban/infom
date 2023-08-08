import { Injectable } from '@angular/core';
import { RootService } from '../root.service';

@Injectable({
  providedIn: 'root'
})
export class DestinoPrestamoService {

  constructor(private rootService: RootService) { }

  route = '/destinos_prestamos';

  getDestinoPrestamos(): Promise<any> {
    return this.rootService.get(this.route);
  }

  getDestinoPrestamo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postDestinoPrestamo(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putDestinoPrestamo(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deleteDestinoPrestamo(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }


}
