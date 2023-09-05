import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {

  constructor(private rootService: RootService) {
  }

  route = '/prestamos';

  getPrestamos(fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getPrestamosEstado(estado: string, fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/' + estado + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getCountPrestamosEstado(estado: string, fecha_inicio: any, fecha_fin: any): Promise<any> {
    return this.rootService.get(this.route + '/count/' + estado + '/' + fecha_inicio + '/' + fecha_fin);
  }

  getPrestamo(id: number): Promise<any> {
    return this.rootService.get(this.route + '/' + id);
  }

  async postPrestamo(data: any): Promise<any> {
    let prestamo = await this.rootService.post(this.route, data);
    if (prestamo.resultado) {
      await this.rootService.bitacora('prestamo', 'agregar', `creó el prestamo "${prestamo.data.id}"`, prestamo.data);
    }
    return prestamo;
  }

  async putPrestamo(id: number, data: any): Promise<any> {
    let prestamo = await this.rootService.put(this.route + '/' + id, data);
    if (prestamo.resultado) {
      await this.rootService.bitacora('prestamo', 'editar', `editó el prestamo "${prestamo.data.id}"`, prestamo.data);
    }
    return prestamo;
  }

  async deletePrestamo(id: number): Promise<any> {
    let prestamo = await this.rootService.delete(this.route + '/' + id);
    if (prestamo.resultado) {
      await this.rootService.bitacora('prestamo', 'eliminar', `eliminó el prestamo "${prestamo.data.id}"`, prestamo.data);
    }
    return prestamo;
  }


}

