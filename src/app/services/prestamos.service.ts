import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {

  constructor(private rootService: RootService) {
  }

  route = '/prestamos';

  getPrestamos(estado: string, fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/' + estado + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getPrestamo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  postPrestamo(data: any): Promise<any> {
    return this.rootService.post(this.route, data);
  }

  putPrestamo(id: number, data: any): Promise<any> {
    return this.rootService.put(this.route + '/' + id, data);
  }

  deletePrestamo(id: number): Promise<any> {
    return this.rootService.delete(this.route + '/' + id);
  }


}

