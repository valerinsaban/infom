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

  async postTipoPrestamo(data: any): Promise<any> {
    let tipo_prestamo = await this.rootService.post(this.route, data);
    if (tipo_prestamo.resultado) {
      await this.rootService.bitacora('tipo_prestamo', 'agregar', `creó el tipo prestamo "${tipo_prestamo.data.nombre}"`, tipo_prestamo.data);
    }
    return tipo_prestamo;
  }

  async putTipoPrestamo(id: number, data: any): Promise<any> {
    let tipo_prestamo = await this.rootService.put(this.route + '/' + id, data);
    if (tipo_prestamo.resultado) {
      await this.rootService.bitacora('tipo_prestamo', 'editar', `editó el tipo prestamo "${tipo_prestamo.data.nombre}"`, tipo_prestamo.data);
    }
    return tipo_prestamo;
  }

  async deleteTipoPrestamo(id: number): Promise<any> {
    let tipo_prestamo = await this.rootService.delete(this.route + '/' + id);
    if (tipo_prestamo.resultado) {
      await this.rootService.bitacora('tipo_prestamo', 'eliminar', `eliminó el tipo prestamo "${tipo_prestamo.data.nombre}"`, tipo_prestamo.data);
    }
    return tipo_prestamo;
  }
}
